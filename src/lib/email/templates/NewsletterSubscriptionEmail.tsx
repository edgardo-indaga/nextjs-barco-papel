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

interface NewsletterSubscriptionEmailProps {
    userEmail: string;
}

export default function NewsletterSubscriptionEmail({
    userEmail,
}: NewsletterSubscriptionEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>¡Bienvenido al Newsletter de Barco de Papel!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={h1}>🚢 Barco de Papel</Heading>
                    </Section>

                    <Section style={section}>
                        <Heading style={h2}>¡Bienvenido a nuestro Newsletter!</Heading>
                        <Text style={text}>Gracias por suscribirte a nuestro boletín mensual.</Text>
                        <Text style={text}>
                            Te mantendremos informado sobre los últimos eventos, noticias y novedades
                            de nuestra comunidad literaria.
                        </Text>

                        <Section style={emailSection}>
                            <Text style={emailText}>Tu email registrado:</Text>
                            <Text style={emailValue}>{userEmail}</Text>
                        </Section>

                        <Section style={infoSection}>
                            <Text style={infoTitle}>📚 ¿Qué recibirás?</Text>
                            <Text style={infoText}>• Novedades sobre eventos literarios</Text>
                            <Text style={infoText}>• Noticias y artículos exclusivos</Text>
                            <Text style={infoText}>• Contenido cultural seleccionado</Text>
                            <Text style={infoText}>• Actualizaciones de la comunidad</Text>
                        </Section>

                        <Section style={buttonSection}>
                            <Button style={button} href="https://www.barcodepapel.cl">
                                Visitar Barco de Papel
                            </Button>
                        </Section>

                        <Text style={footer}>
                            Saludos,
                            <br />
                            <strong>Equipo Barco de Papel</strong>
                        </Text>

                        <Text style={footerNote}>
                            Si no te suscribiste a este newsletter, puedes ignorar este email.
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

const emailSection = {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'center' as const,
};

const emailText = {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0 0 8px',
};

const emailValue = {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
};

const infoSection = {
    backgroundColor: '#fef3f3',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    border: '1px solid #fecaca',
};

const infoTitle = {
    color: '#991b1b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const infoText = {
    color: '#7f1d1d',
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
