// Archivo legacy - mantenido por compatibilidad
// El nuevo sistema está en /src/lib/auth/password/

import { recoverPassword as newRecoverPassword } from '@/lib/auth/password/passwordService';

/**
 * @deprecated Usar recoverUserPassword de /lib/auth/password/passwordService
 * Mantenido por compatibilidad con componentes existentes
 */
export async function recoverPassword(email: string) {
    console.log('⚠️ Usando método legacy recoverPassword, considera migrar al nuevo sistema');

    const result = await newRecoverPassword(email);

    // Convertir formato de respuesta para compatibilidad
    return {
        message: result.success ? result.message : `Error: ${result.message}`,
    };
}
