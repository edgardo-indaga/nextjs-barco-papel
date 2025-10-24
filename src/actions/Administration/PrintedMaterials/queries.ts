'use server';

import prisma from '@/lib/db/db';
import type { PrintedMaterialInterface } from '@/types/Administration/PrintedMaterials/PrintedMaterialInterface';

export async function getAllMaterial(): Promise<PrintedMaterialInterface[]> {
    try {
        return await prisma.printedMaterial.findMany({
            select: {
                id: true,
                name: true,
                numberVersion: true,
                description: true,
                link: true,
            },
            orderBy: {
                numberVersion: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching material', error);
        throw error;
    }
}

export async function getMaterialById(id: string) {
    try {
        return await prisma.printedMaterial.findUnique({
            where: { id },
            select: {
                id: true,
                image: true,
                numberVersion: true,
                name: true,
                description: true,
                link: true,
            },
        });
    } catch (error) {
        console.error('Error fetching material by ID', error);
        throw error;
    }
}

export async function getAllMaterialHome(): Promise<PrintedMaterialInterface[]> {
    try {
        return await prisma.printedMaterial.findMany({
            select: {
                id: true,
                image: true,
                name: true,
                numberVersion: true,
                description: true,
                link: true,
            },
            orderBy: {
                numberVersion: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching material', error);
        throw error;
    }
}
