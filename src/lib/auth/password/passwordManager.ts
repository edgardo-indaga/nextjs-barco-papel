import { randomBytes } from 'node:crypto';

import bcrypt from 'bcrypt';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import prisma from '@/lib/db/db';

import { sendGridService } from '@/lib/email/sendgridService';
import type { PasswordResetOptions, PasswordResetResult, UserPasswordResetData } from './types';

/**
 * Genera una contraseña temporal segura usando crypto.randomBytes
 * Incluye números, letras mayúsculas, minúsculas y algunos símbolos seguros
 */
function generateSecurePassword(length = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const randomBuffer = randomBytes(length);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[randomBuffer[i] % charset.length];
    }
    return password;
}

/**
 * Busca usuario por email
 */
async function findUserByEmail(email: string): Promise<UserPasswordResetData | null> {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            password: true,
        },
    });
}

/**
 * Busca usuario por ID
 */
async function findUserById(userId: string): Promise<UserPasswordResetData | null> {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            password: true,
        },
    });
}

/**
 * Actualiza la contraseña del usuario en la base de datos
 */
async function updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
}

/**
 * Registra evento de auditoría para reset de contraseña
 */
async function logPasswordResetEvent(
    user: UserPasswordResetData,
    options: PasswordResetOptions,
    emailSent: boolean,
): Promise<void> {
    const description =
        options.resetType === 'user_recovery'
            ? `Recuperación de contraseña completada para ${user.email}`
            : `Reset de contraseña para usuario "${user.name} ${user.lastName || ''}"`;

    await logAuditEvent({
        action: AUDIT_ACTIONS.USER.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: user.id,
        description,
        metadata: {
            userId: user.id,
            email: user.email,
            resetType: options.resetType,
            emailSent,
            resetByUserId: options.resetByUserId,
            resetByUserName: options.resetByUserName,
            previousPasswordHash: `${user.password.substring(0, 10)}...`,
            resetTimestamp: new Date().toISOString(),
            emailService: 'SendGrid',
        },
        userId: options.resetByUserId,
        userName: options.resetByUserName,
    });
}

/**
 * Función principal unificada para manejo de reset de contraseñas
 * Maneja tanto recovery de usuario como reset administrativo
 */
export async function handlePasswordReset(
    identifier: string, // email para recovery, userId para admin reset
    options: PasswordResetOptions,
): Promise<PasswordResetResult> {
    try {
        console.log(`🔐 Iniciando ${options.resetType} para:`, identifier);

        // 1. Buscar usuario según el tipo de reset
        let user: UserPasswordResetData | null;

        if (options.resetType === 'user_recovery') {
            user = await findUserByEmail(identifier);
            if (!user) {
                console.log('❌ Usuario no encontrado con email:', identifier);
                return {
                    success: false,
                    error: 'No se encontró un usuario con ese email',
                    message:
                        'No se encontró un usuario con ese email. Verifica que el email sea correcto.',
                };
            }
        } else {
            user = await findUserById(identifier);
            if (!user) {
                console.log('❌ Usuario no encontrado con ID:', identifier);
                return {
                    success: false,
                    error: 'Usuario no encontrado',
                    message: 'No se pudo encontrar el usuario especificado.',
                };
            }
        }

        console.log('✅ Usuario encontrado:', user.email);

        // 2. Generar nueva contraseña temporal segura
        const temporaryPassword = generateSecurePassword(12);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        console.log('✅ Nueva contraseña temporal generada');

        // 3. Actualizar contraseña en la base de datos
        await updateUserPassword(user.id, hashedPassword);
        console.log('✅ Contraseña actualizada en base de datos');

        // 4. Enviar email si está habilitado
        let emailSent = false;

        if (options.sendEmail && sendGridService.isConfigured()) {
            const resetBy =
                options.resetType === 'user_recovery'
                    ? 'Usuario'
                    : options.resetByUserName || 'Administrador';

            console.log('📧 Intentando enviar email de recuperación...');

            const emailResult = await sendGridService.sendPasswordResetEmail({
                userName: `${user.name} ${user.lastName || ''}`.trim(),
                temporaryPassword,
                resetBy,
                userEmail: user.email,
            });

            emailSent = emailResult.success;

            if (emailResult.success) {
                console.log('✅ Email enviado exitosamente');
                if (emailResult.messageId) {
                    console.log('📨 Message ID:', emailResult.messageId);
                }
            } else {
                console.error('❌ Fallo en envío de email:', emailResult.error);
            }
        } else if (options.sendEmail) {
            console.error('❌ SendGrid Email service no está configurado');
        }

        // 5. Registrar auditoría
        await logPasswordResetEvent(user, options, emailSent);
        console.log('✅ Evento de auditoría registrado');

        // 6. Retornar resultado
        const successMessage =
            options.resetType === 'user_recovery'
                ? emailSent
                    ? 'Se ha enviado una nueva contraseña temporal a tu email. Revisa tu bandeja de entrada y carpeta de spam.'
                    : 'Nueva contraseña temporal generada correctamente.'
                : emailSent
                  ? 'Contraseña restablecida exitosamente y email enviado al usuario.'
                  : 'Contraseña restablecida exitosamente.';

        console.log('✅ Proceso completado exitosamente');

        return {
            success: true,
            temporaryPassword,
            emailSent,
            message: successMessage,
        };
    } catch (error) {
        console.error('❌ Error en handlePasswordReset:', error);

        const errorMessage =
            options.resetType === 'user_recovery'
                ? 'No se pudo procesar la solicitud de recuperación. Por favor, inténtelo de nuevo en unos momentos.'
                : 'Error al restablecer la contraseña. Por favor, inténtelo de nuevo.';

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
            message: errorMessage,
        };
    }
}
