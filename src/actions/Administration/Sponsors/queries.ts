'use server';

import prisma from '@/lib/db/db';
import type { SponsorsCarouselInterface } from '@/types/Administration/Sponsors/SponsorsCarouselInterface';
import type { SponsorsInterface } from '@/types/Administration/Sponsors/SponsorsInterface';

export async function getAllSponsors(): Promise<SponsorsInterface[]> {
    try {
        return await prisma.sponsors.findMany({
            select: {
                id: true,
                name: true,
                link: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching sponsors', error);
        throw error;
    }
}

export async function getAllSponsorsForCarousel(): Promise<SponsorsCarouselInterface[]> {
    try {
        return await prisma.sponsors.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                link: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching sponsors for carousel', error);
        throw error;
    }
}

export async function getSponsorById(id: string): Promise<SponsorsInterface | null> {
    try {
        return await prisma.sponsors.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                link: true,
            },
        });
    } catch (error) {
        console.error('Error fetching sponsor by ID', error);
        throw error;
    }
}
