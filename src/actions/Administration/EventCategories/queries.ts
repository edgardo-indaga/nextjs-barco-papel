'use server';

import prisma from '@/lib/db/db';
import type {
    EventCategoryInterface,
    EventCategoryUniqueInterface,
} from '@/types/Administration/EventCategories/EventCategoriesInterface';

export async function getAllEventCategories(): Promise<EventCategoryInterface[]> {
    try {
        const response = await prisma.eventCategories.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc', // Ordenar alfabéticamente
            },
        });

        return response;
    } catch (error) {
        console.error('Error fetching Event Categories', error);
        throw error;
    }
}

export async function getEventCategoryById(
    id: string,
): Promise<EventCategoryUniqueInterface | null> {
    try {
        const response = await prisma.eventCategories.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!response) {
            return null;
        }

        return response;
    } catch (error) {
        console.error(`Error fetching event category with ID ${id}:`, error);
        throw error;
    }
}

// Función simple para obtener categorías para selects
export async function getEventCategoriesForSelect(): Promise<{ id: string; name: string }[]> {
    try {
        const response = await prisma.eventCategories.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return response;
    } catch (error) {
        console.error('Error fetching Event Categories for select', error);
        throw error;
    }
}
