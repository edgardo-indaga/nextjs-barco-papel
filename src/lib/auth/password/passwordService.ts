'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/lib/auth/authOptions';

import { handlePasswordReset } from './passwordManager';
import type { PasswordResetResult } from './types';

/**
 * Server Action para recuperación de contraseña por email (user recovery)
 * Usado en formularios públicos como /recovery
 */
export async function recoverUserPassword(formData: FormData): Promise<PasswordResetResult> {
    const email = formData.get('email') as string;

    if (!email) {
        return {
            success: false,
            error: 'Email requerido',
            message: 'Por favor, ingresa tu dirección de email.',
        };
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            error: 'Formato de email inválido',
            message: 'Por favor, ingresa un email con formato válido.',
        };
    }

    console.log('🔐 Iniciando recuperación de contraseña para:', email);

    return await handlePasswordReset(email, {
        resetType: 'user_recovery',
        sendEmail: true, // Siempre enviar email en recovery
    });
}

/**
 * Server Action directo para recuperación por email (compatibilidad)
 */
export async function recoverPassword(email: string): Promise<PasswordResetResult> {
    if (!email) {
        return {
            success: false,
            error: 'Email requerido',
            message: 'Por favor, proporciona una dirección de email.',
        };
    }

    console.log('🔐 Recuperación de contraseña (método legacy) para:', email);

    return await handlePasswordReset(email, {
        resetType: 'user_recovery',
        sendEmail: true,
    });
}

/**
 * Server Action para reset administrativo de contraseña
 * Usado en paneles de administración
 */
export async function resetUserPassword(
    userId: string,
    options?: { sendEmail?: boolean },
): Promise<PasswordResetResult> {
    if (!userId) {
        return {
            success: false,
            error: 'User ID requerido',
            message: 'ID de usuario es requerido para el reset.',
        };
    }

    // Obtener información del admin que realiza el reset
    const session = await getServerSession(authOptions);
    const resetByUserName = session?.user?.name
        ? `${session.user.name} ${session.user.lastName || ''}`.trim()
        : 'Administrador';

    console.log(
        '🔐 Reset administrativo de contraseña para userId:',
        userId,
        'por:',
        resetByUserName,
    );

    const result = await handlePasswordReset(userId, {
        resetType: 'admin_reset',
        sendEmail: options?.sendEmail ?? true,
        resetByUserId: session?.user?.id,
        resetByUserName,
    });

    // Revalidar caché si el reset fue exitoso
    if (result.success) {
        revalidatePath('/admin/settings/users');
        console.log('✅ Cache revalidado para /admin/settings/users');
    }

    return result;
}
