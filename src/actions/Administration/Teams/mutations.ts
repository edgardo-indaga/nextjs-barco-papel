'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';

export async function createTeam(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File | null;

        if (!name) {
            return { error: 'Teams name required' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'teams',
                    prefix: 'team-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.teams.create({
            data: {
                name,
                description,
                image: imageUrl,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TEAMS.CREATE,
            entity: AUDIT_ENTITIES.TEAMS,
            entityId: response.id,
            description: `Team "${name}" created`,
            metadata: {
                teamId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/teams');
        return response;
    } catch (error) {
        console.error('Error creating team', error);
        throw error;
    }
}

export async function deleteTeam(id: string) {
    try {
        if (!id) {
            return { error: 'Team not found' };
        }

        const teamToDelete = await prisma.teams.findUnique({
            where: { id },
        });

        if (!teamToDelete) {
            return { error: 'Team does not exist' };
        }

        // Eliminar la imagen si existe
        if (teamToDelete.image) {
            await deleteFile(teamToDelete.image);
        }

        const response = await prisma.teams.deleteMany({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TEAMS.DELETE,
            entity: AUDIT_ENTITIES.TEAMS,
            entityId: id,
            description: `Team "${teamToDelete.name}" deleted`,
            metadata: {
                teamId: id,
                name: teamToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/teams');
        return response;
    } catch (error) {
        console.error('Error delete team', error);
        throw error;
    }
}

export async function updateTeam(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Team ID is required' };
        }

        const currentTeam = await prisma.teams.findUnique({
            where: { id },
        });

        if (!currentTeam) {
            return { error: 'Team does not exist' };
        }

        const name = (formData.get('name') as string) || currentTeam.name;
        const description = (formData.get('description') as string) || currentTeam.description;
        const imageFile = formData.get('image') as File | null;
        const currentImage = formData.get('currentImage') as string | null;

        const updateData: { name: string; description: string; image?: string | null } = {
            name,
            description,
        };

        // Solo procesar nueva imagen si se proporciona un archivo
        if (imageFile && imageFile.size > 0) {
            try {
                const newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'teams',
                    prefix: 'team-',
                });

                // Si la subida fue exitosa, usar la nueva imagen
                if (newImageUrl) {
                    updateData.image = newImageUrl;

                    // Eliminar imagen anterior si existe y es diferente
                    if (currentTeam.image && currentTeam.image !== newImageUrl) {
                        await deleteFile(currentTeam.image);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        } else if (currentImage) {
            // Si no hay archivo nuevo pero hay currentImage, usarla
            updateData.image = currentImage;
        }

        const response = await prisma.teams.update({
            where: { id },
            data: updateData,
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.UPDATE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: id,
            description: `Team "${name}" updated`,
            metadata: {
                before: {
                    name: currentTeam.name,
                },
                after: {
                    name: response.name,
                },
                changes: {
                    name:
                        name !== currentTeam.name
                            ? { from: currentTeam.name, to: name }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/teams');
        return response;
    } catch (error) {
        console.error('Error updating team', error);
        throw error;
    }
}
