import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';

import ResetPasswordEmail from '@/lib/email/templates/ResetPasswordEmail';
import type { EmailConfig, EmailSendResult, PasswordResetEmailData } from '../password/types';

class SendGridEmailService {
    private config: EmailConfig | null = null;

    constructor() {
        this.initializeConfig();
    }

    private initializeConfig(): void {
        const apiKey = process.env.SENDGRID_API_KEY;
        const senderEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM;
        const senderName = process.env.SENDGRID_FROM_NAME || 'Barco de Papel';

        if (!apiKey) {
            console.error('❌ SENDGRID_API_KEY no encontrada en variables de entorno');
            this.config = null;
            return;
        }

        if (!senderEmail) {
            console.error('❌ SENDGRID_FROM_EMAIL no encontrada en variables de entorno');
            this.config = null;
            return;
        }

        this.config = {
            apiKey,
            senderName,
            senderEmail,
        };

        // Configurar SendGrid
        sgMail.setApiKey(this.config.apiKey);

        console.log('✅ SendGrid Email service inicializado con sender:', this.config.senderEmail);
    }

    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<EmailSendResult> {
        console.log('📧 Enviando email de recuperación a:', data.userEmail);

        if (!this.config) {
            console.error('❌ SendGrid Email service no configurado');
            return {
                success: false,
                error: 'SendGrid Email service no configurado (falta SENDGRID_API_KEY)',
            };
        }

        try {
            // Generar HTML email usando React-email
            const emailHtml = await render(
                ResetPasswordEmail({
                    userName: data.userName,
                    temporaryPassword: data.temporaryPassword,
                    resetBy: data.resetBy,
                }),
            );

            // Configurar mensaje para SendGrid
            const msg = {
                to: {
                    email: data.userEmail,
                    name: data.userName,
                },
                from: {
                    email: this.config.senderEmail,
                    name: this.config.senderName,
                },
                subject: 'Contraseña Restablecida - Barco de Papel',
                html: emailHtml,
                // Agregar versión de texto plano como fallback
                text: `
Hola ${data.userName},

Tu contraseña ha sido restablecida por un ${data.resetBy}. 

Tu nueva contraseña temporal es: ${data.temporaryPassword}

IMPORTANTE:
• Esta contraseña es temporal y debe cambiarse después del primer inicio de sesión
• Por seguridad, no compartas esta contraseña con nadie  
• Si no solicitaste este cambio, contacta inmediatamente al administrador

Puedes iniciar sesión en: https://www.barcodepapel.cl/login

Saludos,
Equipo Barco de Papel
                `.trim(),
                // Configuraciones adicionales para mejor entrega
                trackingSettings: {
                    clickTracking: {
                        enable: true,
                    },
                    openTracking: {
                        enable: true,
                    },
                },
                // Categorías para analytics
                categories: ['password_reset', 'authentication'],
            };

            console.log(
                '📧 Configuración email: FROM',
                this.config.senderEmail,
                'TO',
                data.userEmail,
            );

            // Enviar email
            const response = await sgMail.send(msg);

            console.log(
                '✅ Email enviado exitosamente! Message ID:',
                response[0]?.headers?.['x-message-id'] || 'No ID',
            );

            return { success: true };
        } catch (error) {
            console.error('❌ FALLO ENVÍO EMAIL:', error);

            // Manejo específico de errores de SendGrid
            if (error && typeof error === 'object' && 'response' in error) {
                const sgError = error as any;
                if (sgError.response?.body) {
                    console.error(
                        '❌ SendGrid API Error:',
                        JSON.stringify(sgError.response.body, null, 2),
                    );
                }
            }

            return {
                success: false,
                error:
                    error instanceof Error ? error.message : 'Error desconocido en envío de email',
            };
        }
    }

    isConfigured(): boolean {
        return this.config !== null;
    }

    /**
     * Método para probar la configuración de SendGrid
     */
    async testConfiguration(): Promise<{ success: boolean; message: string }> {
        if (!this.isConfigured()) {
            return {
                success: false,
                message: 'SendGrid no está configurado correctamente',
            };
        }

        try {
            // Enviar un email de prueba a una dirección de test
            const testEmail = this.config!.senderEmail;

            const msg = {
                to: testEmail,
                from: {
                    email: this.config!.senderEmail,
                    name: this.config!.senderName,
                },
                subject: 'Test de Configuración SendGrid - Barco de Papel',
                text: 'Este es un email de prueba para verificar la configuración de SendGrid.',
                html: '<p>Este es un email de prueba para verificar la configuración de SendGrid.</p>',
            };

            await sgMail.send(msg);

            return {
                success: true,
                message: 'Configuración de SendGrid verificada correctamente',
            };
        } catch (error) {
            return {
                success: false,
                message: `Error en configuración SendGrid: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            };
        }
    }
}

// Export singleton instance
export const sendGridEmailService = new SendGridEmailService();
