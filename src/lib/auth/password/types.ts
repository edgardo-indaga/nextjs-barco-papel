// Tipos para el sistema de recuperación de contraseña

export interface PasswordResetOptions {
    resetType: 'user_recovery' | 'admin_reset';
    sendEmail?: boolean;
    resetByUserId?: string;
    resetByUserName?: string;
}

export interface PasswordResetResult {
    success: boolean;
    temporaryPassword?: string;
    emailSent?: boolean;
    message: string;
    error?: string;
}

export interface UserPasswordResetData {
    id: string;
    name: string;
    lastName: string | null;
    email: string;
    password: string;
}

export interface EmailConfig {
    apiKey: string;
    senderName: string;
    senderEmail: string;
}

export interface EmailSendResult {
    success: boolean;
    error?: string;
}

export interface PasswordResetEmailData {
    userName: string;
    userEmail: string;
    temporaryPassword: string;
    resetBy: string;
}
