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

interface TicketNotificationEmailProps {
    ticketCode: string;
    ticketTitle: string;
    ticketPriority: string;
    ticketDescription?: string;
    userName: string;
    userEmail: string;
}

export default function TicketNotificationEmail({
    ticketCode,
    ticketTitle,
    ticketPriority,
    ticketDescription,
    userName,
    userEmail,
}: TicketNotificationEmailProps) {
    const priorityColor =
        ticketPriority === 'HIGH'
            ? '#dc2626'
            : ticketPriority === 'MEDIUM'
              ? '#f59e0b'
              : '#10b981';

    const priorityLabel =
        ticketPriority === 'HIGH'
            ? 'Alta'
            : ticketPriority === 'MEDIUM'
              ? 'Media'
              : 'Baja';

    return (
        <Html>
            <Head />
            <Preview>Nuevo Ticket Creado: {ticketCode}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Heading style={h1}>🚢 Barco de Papel</Heading>
                        <Text style={subtitle}>Sistema de Tickets</Text>
                    </Section>

                    <Section style={section}>
                        <Heading style={h2}>Nuevo Ticket Creado</Heading>
                        <Text style={text}>Se ha creado un nuevo ticket en el sistema.</Text>

                        <Section style={ticketInfoSection}>
                            <Text style={ticketLabel}>Código del Ticket:</Text>
                            <Text style={ticketCodeStyle}>{ticketCode}</Text>

                            <Text style={ticketLabel}>Título:</Text>
                            <Text style={ticketValue}>{ticketTitle}</Text>

                            <Text style={ticketLabel}>Prioridad:</Text>
                            <Text
                                style={{
                                    ...priorityBadge,
                                    backgroundColor: priorityColor,
                                }}>
                                {priorityLabel}
                            </Text>

                            {ticketDescription && (
                                <>
                                    <Text style={ticketLabel}>Descripción:</Text>
                                    <Text style={ticketDescriptionStyle}>{ticketDescription}</Text>
                                </>
                            )}
                        </Section>

                        <Section style={userSection}>
                            <Text style={userTitle}>👤 Información del Usuario</Text>
                            <Text style={userText}>
                                <strong>Nombre:</strong> {userName}
                            </Text>
                            <Text style={userText}>
                                <strong>Email:</strong> {userEmail}
                            </Text>
                        </Section>

                        <Section style={buttonSection}>
                            <Button style={button} href="https://www.barcodepapel.cl/admin/settings/tickets">
                                Ver Ticket en Admin
                            </Button>
                        </Section>

                        <Text style={footer}>
                            Este es un email automático del sistema de tickets.
                            <br />
                            <strong>Equipo Barco de Papel</strong>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Estilos
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
    backgroundColor: '#1e293b',
    borderRadius: '8px 8px 0 0',
    margin: '0 0 32px 0',
};

const h1 = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    margin: '20px 0 10px',
    textAlign: 'center' as const,
};

const subtitle = {
    color: '#94a3b8',
    fontSize: '14px',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const h2 = {
    color: '#f50a86',
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

const ticketInfoSection = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
    border: '2px solid #e5e7eb',
};

const ticketLabel = {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    margin: '16px 0 4px',
    letterSpacing: '0.5px',
};

const ticketCodeStyle = {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    letterSpacing: '2px',
    margin: '0 0 16px',
};

const ticketValue = {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px',
};

const ticketDescriptionStyle = {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
};

const priorityBadge = {
    display: 'inline-block',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
    margin: '0',
};

const userSection = {
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
    border: '1px solid #dbeafe',
};

const userTitle = {
    color: '#1e40af',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px',
};

const userText = {
    color: '#1e3a8a',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#f50a86',
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
};

const footer = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '32px 0 16px',
    textAlign: 'center' as const,
};
