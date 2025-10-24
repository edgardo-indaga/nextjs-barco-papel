'use server';

import { sendGridService } from '@/lib/email/sendgridService';

interface NewsletterSubscriptionResult {
    success: boolean;
    message: string;
    error?: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriptionResult> {
    try {
        // Validación básica del email
        if (!email || !email.includes('@')) {
            return {
                success: false,
                message: 'Email inválido',
                error: 'INVALID_EMAIL',
            };
        }

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: 'Por favor, ingresa un email con formato válido.',
                error: 'INVALID_EMAIL_FORMAT',
            };
        }

        console.log('📰 Procesando suscripción al newsletter para:', email);

        // Verificar que SendGrid esté configurado
        if (!sendGridService.isConfigured()) {
            console.error('❌ SendGrid no está configurado');
            return {
                success: false,
                message: 'Error de configuración del servidor',
                error: 'MISSING_CONFIGURATION',
            };
        }

        // Enviar email de confirmación usando SendGrid
        const emailResult = await sendGridService.sendNewsletterSubscriptionEmail({
            userEmail: email,
        });

        if (!emailResult.success) {
            console.error('❌ Error enviando email:', emailResult.error);
            return {
                success: false,
                message: 'Error al procesar la suscripción. Inténtalo nuevamente.',
                error: 'SEND_ERROR',
            };
        }

        console.log('✅ Email de suscripción enviado exitosamente');
        if (emailResult.messageId) {
            console.log('📨 Message ID:', emailResult.messageId);
        }

        return {
            success: true,
            message: '¡Suscripción exitosa! Revisa tu email para confirmar.',
        };
    } catch (error) {
        console.error('❌ Error en subscribeToNewsletter:', error);
        return {
            success: false,
            message: 'Error al procesar la suscripción. Inténtalo nuevamente.',
            error: 'UNEXPECTED_ERROR',
        };
    }
}
