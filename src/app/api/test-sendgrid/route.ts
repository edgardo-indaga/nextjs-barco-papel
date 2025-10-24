import { NextRequest, NextResponse } from 'next/server';
import { sendGridService } from '@/lib/email/sendgridService';

// API route para probar la configuración de SendGrid
export async function GET(request: NextRequest) {
    try {
        // Verificar que el servicio esté configurado
        if (!sendGridService.isConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'SendGrid no está configurado',
                    message:
                        'Verifica que SENDGRID_API_KEY y SENDGRID_FROM_EMAIL estén configurados en las variables de entorno',
                },
                { status: 400 },
            );
        }

        // Ejecutar test de configuración
        const testResult = await sendGridService.testConfiguration();

        if (testResult.success) {
            return NextResponse.json({
                success: true,
                message: testResult.message,
                configuration: {
                    isConfigured: true,
                    service: 'SendGrid',
                    timestamp: new Date().toISOString(),
                },
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: testResult.message,
                    message: 'Error en la configuración de SendGrid',
                },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error('Error testing SendGrid:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
                message: 'Error interno al probar SendGrid',
            },
            { status: 500 },
        );
    }
}

// Endpoint POST para enviar un email de prueba personalizado
export async function POST(request: NextRequest) {
    try {
        const { email, userName } = await request.json();

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email requerido',
                    message: 'Proporciona un email para la prueba',
                },
                { status: 400 },
            );
        }

        if (!sendGridService.isConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'SendGrid no configurado',
                    message: 'SendGrid no está configurado correctamente',
                },
                { status: 400 },
            );
        }

        // Enviar email de prueba de recuperación de contraseña
        const result = await sendGridService.sendPasswordResetEmail({
            userName: userName || 'Usuario de Prueba',
            userEmail: email,
            temporaryPassword: 'TestPassword123!',
            resetBy: 'Administrador (Prueba)',
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Email de prueba enviado exitosamente',
                sentTo: email,
                timestamp: new Date().toISOString(),
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                    message: 'Error enviando email de prueba',
                },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
                message: 'Error interno enviando email de prueba',
            },
            { status: 500 },
        );
    }
}
