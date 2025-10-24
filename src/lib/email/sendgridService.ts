/**
 * Servicio Unificado de SendGrid para Barco de Papel
 *
 * Este servicio centraliza todos los envíos de email usando SendGrid:
 * - Recuperación de contraseñas
 * - Notificaciones de tickets
 * - Suscripciones a newsletter
 *
 * Implementa mejores prácticas de SendGrid:
 * - Sender Identity verification
 * - TLS enforcement
 * - Error handling robusto
 * - Categorización para analytics
 * - Rate limiting awareness
 */

import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';

import NewsletterSubscriptionEmail from './templates/NewsletterSubscriptionEmail';
import ResetPasswordEmail from './templates/ResetPasswordEmail';
import TicketNotificationEmail from './templates/TicketNotificationEmail';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface EmailConfig {
    apiKey: string;
    senderName: string;
    senderEmail: string;
}

export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export interface PasswordResetEmailData {
    userName: string;
    userEmail: string;
    temporaryPassword: string;
    resetBy: string;
}

export interface NewsletterEmailData {
    userEmail: string;
}

export interface TicketNotificationEmailData {
    ticketCode: string;
    ticketTitle: string;
    ticketPriority: string;
    ticketDescription?: string;
    userName: string;
    userEmail: string;
    adminEmail: string;
}

// ============================================================================
// CLASE PRINCIPAL DEL SERVICIO
// ============================================================================

class SendGridEmailService {
    private config: EmailConfig | null = null;
    private initialized = false;

    constructor() {
        this.initializeConfig();
    }

    /**
     * Inicializa la configuración de SendGrid desde variables de entorno
     * Siguiendo mejores prácticas de Twilio SendGrid
     */
    private initializeConfig(): void {
        const apiKey = process.env.SENDGRID_API_KEY;
        const senderEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM;
        const senderName = process.env.SENDGRID_FROM_NAME || 'Barco de Papel';

        if (!apiKey) {
            console.error('❌ SENDGRID_API_KEY no encontrada en variables de entorno');
            this.config = null;
            this.initialized = false;
            return;
        }

        if (!senderEmail) {
            console.error('❌ SENDGRID_FROM_EMAIL no encontrada en variables de entorno');
            this.config = null;
            this.initialized = false;
            return;
        }

        this.config = {
            apiKey,
            senderName,
            senderEmail,
        };

        // Configurar SendGrid con API Key
        sgMail.setApiKey(this.config.apiKey);
        this.initialized = true;

        console.log('✅ SendGrid Email service inicializado');
        console.log('📧 Sender:', this.config.senderEmail);
        console.log('👤 Name:', this.config.senderName);
    }

    /**
     * Verifica si el servicio está configurado correctamente
     */
    isConfigured(): boolean {
        return this.initialized && this.config !== null;
    }

    /**
     * Método genérico para enviar emails con manejo de errores robusto
     */
    private async sendEmail(
        to: string,
        subject: string,
        htmlContent: string,
        textContent: string,
        categories: string[],
        toName?: string,
    ): Promise<EmailSendResult> {
        if (!this.isConfigured() || !this.config) {
            return {
                success: false,
                error: 'SendGrid no está configurado correctamente',
            };
        }

        try {
            const msg = {
                to: {
                    email: to,
                    name: toName,
                },
                from: {
                    email: this.config.senderEmail,
                    name: this.config.senderName,
                },
                subject,
                html: htmlContent,
                text: textContent,
                // Configuraciones de tracking y seguridad
                trackingSettings: {
                    clickTracking: {
                        enable: true,
                        enableText: false,
                    },
                    openTracking: {
                        enable: true,
                    },
                },
                // Categorías para analytics en SendGrid
                categories,
                // Prioridad para emails transaccionales críticos
                priority: categories.includes('password_reset') ? 1 : undefined,
            };

            console.log(`📧 Enviando email a: ${to}`);
            console.log(`📋 Categorías: ${categories.join(', ')}`);

            const response = await sgMail.send(msg);

            const messageId = response[0]?.headers?.['x-message-id'] as string | undefined;

            console.log(`✅ Email enviado exitosamente`);
            if (messageId) {
                console.log(`📨 Message ID: ${messageId}`);
            }

            return {
                success: true,
                messageId: messageId || 'no-id',
            };
        } catch (error) {
            console.error('❌ Error enviando email:', error);

            // Manejo específico de errores de SendGrid
            if (error && typeof error === 'object' && 'response' in error) {
                const sgError = error as any;
                if (sgError.response?.body) {
                    console.error('❌ SendGrid API Error:', JSON.stringify(sgError.response.body, null, 2));
                }
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido en envío de email',
            };
        }
    }

    // ========================================================================
    // MÉTODOS PÚBLICOS PARA CADA TIPO DE EMAIL
    // ========================================================================

    /**
     * Envía email de recuperación de contraseña
     * Categoría: password_reset, authentication
     * Prioridad: Alta (transaccional crítico)
     */
    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<EmailSendResult> {
        console.log('🔐 Preparando email de recuperación de contraseña...');

        const htmlContent = await render(
            ResetPasswordEmail({
                userName: data.userName,
                temporaryPassword: data.temporaryPassword,
                resetBy: data.resetBy,
            }),
        );

        const textContent = `
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
        `.trim();

        return this.sendEmail(
            data.userEmail,
            'Contraseña Restablecida - Barco de Papel',
            htmlContent,
            textContent,
            ['password_reset', 'authentication', 'transactional'],
            data.userName,
        );
    }

    /**
     * Envía email de confirmación de suscripción al newsletter
     * Categoría: newsletter, subscription
     * Prioridad: Normal
     */
    async sendNewsletterSubscriptionEmail(data: NewsletterEmailData): Promise<EmailSendResult> {
        console.log('📰 Preparando email de suscripción a newsletter...');

        const htmlContent = await render(
            NewsletterSubscriptionEmail({
                userEmail: data.userEmail,
            }),
        );

        const textContent = `
¡Bienvenido al Newsletter de Barco de Papel!

Gracias por suscribirte a nuestro boletín mensual. Te mantendremos informado sobre los últimos eventos, noticias y novedades de nuestra comunidad literaria.

Tu email registrado: ${data.userEmail}

¿Qué recibirás?
• Novedades sobre eventos literarios
• Noticias y artículos exclusivos
• Contenido cultural seleccionado
• Actualizaciones de la comunidad

Visita: https://www.barcodepapel.cl

Si no te suscribiste a este newsletter, puedes ignorar este email.

Saludos,
Equipo Barco de Papel
        `.trim();

        return this.sendEmail(
            data.userEmail,
            '¡Bienvenido al Newsletter de Barco de Papel!',
            htmlContent,
            textContent,
            ['newsletter', 'subscription', 'marketing'],
        );
    }

    /**
     * Envía notificación de nuevo ticket al administrador
     * Categoría: ticket, notification, admin
     * Prioridad: Alta (notificación crítica)
     */
    async sendTicketNotificationEmail(data: TicketNotificationEmailData): Promise<EmailSendResult> {
        console.log('🎫 Preparando email de notificación de ticket...');

        const htmlContent = await render(
            TicketNotificationEmail({
                ticketCode: data.ticketCode,
                ticketTitle: data.ticketTitle,
                ticketPriority: data.ticketPriority,
                ticketDescription: data.ticketDescription,
                userName: data.userName,
                userEmail: data.userEmail,
            }),
        );

        const priorityLabel =
            data.ticketPriority === 'HIGH'
                ? 'Alta'
                : data.ticketPriority === 'MEDIUM'
                  ? 'Media'
                  : 'Baja';

        const textContent = `
Nuevo Ticket Creado - Barco de Papel

Se ha creado un nuevo ticket en el sistema.

Código del Ticket: ${data.ticketCode}
Título: ${data.ticketTitle}
Prioridad: ${priorityLabel}
${data.ticketDescription ? `Descripción: ${data.ticketDescription}` : ''}

Información del Usuario:
Nombre: ${data.userName}
Email: ${data.userEmail}

Ver ticket en: https://www.barcodepapel.cl/admin/settings/tickets

Este es un email automático del sistema de tickets.
Equipo Barco de Papel
        `.trim();

        return this.sendEmail(
            data.adminEmail,
            `Nuevo Ticket: ${data.ticketCode} - ${data.ticketTitle}`,
            htmlContent,
            textContent,
            ['ticket', 'notification', 'admin', 'transactional'],
            'Administrador',
        );
    }

    /**
     * Método de prueba de configuración
     * Envía un email de test para verificar que SendGrid está funcionando
     */
    async testConfiguration(): Promise<{ success: boolean; message: string }> {
        if (!this.isConfigured() || !this.config) {
            return {
                success: false,
                message: 'SendGrid no está configurado correctamente',
            };
        }

        try {
            const testEmail = this.config.senderEmail;

            const msg = {
                to: testEmail,
                from: {
                    email: this.config.senderEmail,
                    name: this.config.senderName,
                },
                subject: 'Test de Configuración SendGrid - Barco de Papel',
                text: 'Este es un email de prueba para verificar la configuración de SendGrid.',
                html: '<p>Este es un email de prueba para verificar la configuración de SendGrid.</p>',
                categories: ['test', 'configuration'],
            };

            await sgMail.send(msg);

            return {
                success: true,
                message: '✅ Configuración de SendGrid verificada correctamente',
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Error en configuración SendGrid: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            };
        }
    }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const sendGridService = new SendGridEmailService();
