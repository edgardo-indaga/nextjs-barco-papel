import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    userName: string;
    temporaryPassword: string;
    resetBy?: string;
}

export default function ResetPasswordEmail({
    userName,
    temporaryPassword,
    resetBy = 'Administrador',
}: ResetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Tu contraseña ha sido reseteada - Barco de Papel</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={h1}>🚢 Barco de Papel</Heading>
                    </Section>

                    <Section style={section}>
                        <Heading style={h2}>Contraseña Restablecida</Heading>
                        <Text style={text}>
                            Hola <strong>{userName}</strong>,
                        </Text>
                        <Text style={text}>
                            Tu contraseña ha sido restablecida por un {resetBy}. Hemos generado una
                            nueva contraseña temporal para tu cuenta:
                        </Text>

                        <Section style={passwordSection}>
                            <Text style={passwordText}>{temporaryPassword}</Text>
                        </Section>

                        <Section style={warningSection}>
                            <Text style={warningTitle}>⚠️ Importante:</Text>
                            <Text style={warningText}>
                                • Esta contraseña es temporal y debe cambiarse después del primer
                                inicio de sesión
                            </Text>
                            <Text style={warningText}>
                                • Por seguridad, no compartas esta contraseña con nadie
                            </Text>
                            <Text style={warningText}>
                                • Si no solicitaste este cambio, contacta inmediatamente al
                                administrador
                            </Text>
                        </Section>

                        <Section style={buttonSection}>
                            <Button style={button} href="https://www.barcodepapel.cl/login">
                                Iniciar Sesión
                            </Button>
                        </Section>

                        <Text style={footer}>
                            Saludos,
                            <br />
                            <strong>Equipo Barco de Papel</strong>
                        </Text>

                        <Text style={footerNote}>
                            Si tienes problemas con el enlace, copia y pega la siguiente URL en tu
                            navegador:
                            <br />
                            https://www.barcodepapel.cl/login
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Estilos con la identidad visual de Barco de Papel
const main = {
    backgroundColor: '#f8fafc',
    fontFamily:
        '"BasicSans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const section = {
    padding: '0 48px',
};

const logoSection = {
    padding: '32px 48px 0',
    textAlign: 'center' as const,
    backgroundColor: '#1e293b', // Negro de Barco de Papel
    borderRadius: '8px 8px 0 0',
    margin: '0 0 32px 0',
};

const h1 = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    margin: '20px 0',
    textAlign: 'center' as const,
};

const h2 = {
    color: '#f50a86', // Fucsia de Barco de Papel
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 20px',
};

const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px',
};

const passwordSection = {
    backgroundColor: '#1e293b', // Negro de Barco de Papel
    borderRadius: '8px',
    padding: '24px',
    margin: '32px 0',
    textAlign: 'center' as const,
    border: '2px solid #f50a86', // Borde fucsia
};

const passwordText = {
    color: '#f50a86', // Fucsia de Barco de Papel
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    letterSpacing: '3px',
    margin: '0',
    textShadow: '0 0 10px rgba(245, 10, 134, 0.3)',
};

const warningSection = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    border: '1px solid #f59e0b',
};

const warningTitle = {
    color: '#92400e',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const warningText = {
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#f50a86', // Fucsia de Barco de Papel
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 28px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px 0 rgba(245, 10, 134, 0.25)',
    transition: 'all 0.2s ease-in-out',
};

const footer = {
    color: '#6b7280',
    fontSize: '16px',
    lineHeight: '22px',
    margin: '32px 0 16px',
    textAlign: 'center' as const,
};

const footerNote = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
    margin: '16px 0 0',
    textAlign: 'center' as const,
};
