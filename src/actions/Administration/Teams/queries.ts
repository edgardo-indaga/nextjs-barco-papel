'use server';

import prisma from '@/lib/db/db';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';

export async function getAllTeams(): Promise<TeamsInterface[]> {
    try {
        return await prisma.teams.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching teams', error);
        throw error;
    }
}

export async function getTeamById(id: string): Promise<TeamsInterface | null> {
    try {
        return await prisma.teams.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
            },
        });
    } catch (error) {
        console.error('Error fetching team by ID', error);
        throw error;
    }
}

export async function getAllTeamsHome(): Promise<TeamsInterface[]> {
    try {
        return await prisma.teams.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching teams', error);
        throw error;
    }
}
