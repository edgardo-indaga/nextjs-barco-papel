export interface EventeCalendarInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    venue?: string; // Lugar
    eventDays?: string; // Días del evento
    showTime?: string; // Hora del espectáculo
    audienceType?: string; // Tipo de público
    price: string;
    state: number; // Estado del evento (0=inactivo, 1=activo)
    linkUrl?: string; // Nuevo campo agregado
    eventCategoryId: string; // Nuevo campo requerido
    eventCategory?: {
        id: string;
        name: string;
    }; // Relación con la categoría
    createdAt?: string;
}

export interface EventeCalendarUniqueInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    venue?: string | null; // Lugar
    eventDays?: string | null; // Días del evento
    showTime?: string; // Hora del espectáculo
    audienceType?: string | null;
    price: string;
    state: number; // Estado del evento (0=inactivo, 1=activo)
    linkUrl?: string | null; // Nuevo campo agregado
    eventCategoryId: string; // Nuevo campo requerido
    eventCategory?: {
        id: string;
        name: string;
    }; // Relación con la categoría
    createdAt?: string;
}
