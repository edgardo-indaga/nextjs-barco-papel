import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Función para limpiar HTML y extraer solo texto plano
 * Útil para meta tags OpenGraph y descripciones que no deben contener HTML
 */
export function stripHtmlTags(html: string): string {
    if (!html) return '';

    // Remover todos los tags HTML usando regex
    return html
        .replace(/<[^>]*>/g, '') // Eliminar tags HTML
        .replace(/&nbsp;/g, ' ') // Convertir &nbsp; a espacios
        .replace(/&amp;/g, '&') // Convertir entidades HTML básicas
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // Convertir múltiples espacios en uno solo
        .trim(); // Eliminar espacios al inicio y final
}

/**
 * Función para crear meta description limpia
 * Limpia HTML y trunca a la longitud especificada
 */
export function createMetaDescription(html: string, maxLength: number = 160): string {
    const cleanText = stripHtmlTags(html);

    if (cleanText.length <= maxLength) {
        return cleanText;
    }

    // Truncar y asegurar que no corte palabras a la mitad
    const truncated = cleanText.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength - 20) {
        return truncated.slice(0, lastSpaceIndex) + '...';
    }

    return truncated + '...';
}
