'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';

export async function createSponsor(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const link = formData.get('link') as string;

        if (!name) {
            return { error: 'Sponsor name is required' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'sponsors',
                    prefix: 'sponsor-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.sponsors.create({
            data: {
                name,
                image: imageUrl,
                link,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.SPONSORS.CREATE,
            entity: AUDIT_ENTITIES.SPONSORS,
            entityId: response.id,
            description: `Sponsor "${name}" created`,
            metadata: {
                sponsorId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/sponsors');
        return response;
    } catch (error) {
        console.error('Error creating sponsor', error);
        throw error;
    }
}

export async function deleteSponsor(id: string) {
    try {
        if (!id) {
            return { error: 'Sponsor ID is required' };
        }

        const sponsorToDelete = await prisma.sponsors.findUnique({
            where: { id },
        });

        if (!sponsorToDelete) {
            return { error: 'Sponsor not found' };
        }

        if (sponsorToDelete.image) {
            await deleteFile(sponsorToDelete.image);
        }

        const response = await prisma.sponsors.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.SPONSORS.DELETE,
            entity: AUDIT_ENTITIES.SPONSORS,
            entityId: response.id,
            description: `Sponsor "${response.name}" deleted`,
            metadata: {
                sponsorId: response.id,
                name: response.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/sponsors');
        return response;
    } catch (error) {
        console.error('Error deleting sponsor', error);
        throw error;
    }
}

export async function updateSponsor(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Sponsor ID is required' };
        }

        const currentSponsor = await prisma.sponsors.findUnique({
            where: { id },
        });

        if (!currentSponsor) {
            return { error: 'Sponsor does not exist' };
        }

        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const currentImage = formData.get('currentImage') as string | null;
        const link = formData.get('link') as string;

        let imageToUpdate = currentSponsor.image; // Mantener imagen actual por defecto

        // Solo procesar nueva imagen si se proporciona un archivo
        if (imageFile && imageFile.size > 0) {
            try {
                const newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'sponsors',
                    prefix: 'sponsor-',
                });

                // Si la subida fue exitosa, usar la nueva imagen
                if (newImageUrl) {
                    imageToUpdate = newImageUrl;

                    // Eliminar imagen anterior si existe y es diferente
                    if (currentSponsor.image && currentSponsor.image !== newImageUrl) {
                        await deleteFile(currentSponsor.image);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        } else if (currentImage) {
            // Si no hay archivo nuevo pero hay currentImage, usarla
            imageToUpdate = currentImage;
        }

        const response = await prisma.sponsors.update({
            where: { id },
            data: {
                name,
                image: imageToUpdate, // Usar la imagen calculada
                link,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.SPONSORS.UPDATE,
            entity: AUDIT_ENTITIES.SPONSORS,
            entityId: response.id,
            description: `Sponsor "${name}" updated`,
            metadata: {
                sponsorId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });
        revalidatePath('/admin/administration/sponsors');
        return response;
    } catch (error) {
        console.error('Error updating sponsor', error);
        throw error;
    }
}
