'use server';

import prisma from '@/lib/db/db';
import { generateCategorySlug } from '@/lib/utils/categoryUtils';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

export async function getAllCategories(): Promise<CategoryInterface[]> {
    try {
        return await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
    }
}

export async function getCategoryById(id: string): Promise<CategoryInterface | null> {
    try {
        return await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error('Error fetching category', error);
        throw error;
    }
}

// Función para buscar categoría por slug generado desde el nombre
export async function getCategoryBySlug(slug: string): Promise<CategoryInterface | null> {
    try {
        const categories = await getAllCategories();

        // Buscar la categoría cuyo slug generado coincida
        const category = categories.find((cat) => generateCategorySlug(cat.name) === slug);

        return category || null;
    } catch (error) {
        console.error('Error fetching category by slug', error);
        throw error;
    }
}
