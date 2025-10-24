'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';

export async function createEvent(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const date = formData.get('date') as string;
        const venue = formData.get('venue') as string | null;
        const eventDays = formData.get('eventDays') as string | null;
        const showTime = formData.get('showTime') as string | null;
        const audienceType = formData.get('audienceType') as string | null;
        const price = formData.get('price') as string | null;
        const state = formData.get('state') ? Number.parseInt(formData.get('state') as string) : 1;
        const linkUrl = formData.get('linkUrl') as string | null; // Nuevo campo
        const eventCategoryId = formData.get('eventCategoryId') as string; // Nuevo campo requerido

        // Validar que eventCategoryId esté presente
        if (!eventCategoryId) {
            return { error: 'Category is required' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'events',
                    prefix: 'event-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        // Convertir la fecha a formato ISO-8601 completo
        const dateValue = new Date(date);

        // El precio ahora se maneja como string
        const priceValue = price && price.trim() !== '' ? price.trim() : null;

        const response = await prisma.eventeCalendar.create({
            data: {
                name,
                image: imageUrl,
                date: dateValue,
                venue,
                eventDays,
                showTime,
                audienceType,
                price: priceValue,
                state,
                linkUrl, // Nuevo campo
                eventCategoryId, // Nuevo campo
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.CREATE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: response.id,
            description: `Event "${name}" created`,
            metadata: {
                eventId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error creating event', error);
        throw error;
    }
}

export async function deleteEvent(id: string) {
    try {
        if (!id) {
            return { error: 'Event not found' };
        }

        const eventToDelete = await prisma.eventeCalendar.findUnique({
            where: { id },
        });

        if (!eventToDelete) {
            return { error: 'Event does not exist' };
        }

        if (eventToDelete.image) {
            await deleteFile(eventToDelete.image);
        }

        const response = await prisma.eventeCalendar.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.DELETE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: id,
            description: `Event "${eventToDelete.name}" deleted`,
            metadata: {
                eventId: id,
                name: eventToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error delete event', error);
        throw error;
    }
}

export async function updateEvent(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Event ID is required' };
        }

        const currentEvent = await prisma.eventeCalendar.findUnique({
            where: { id },
        });

        if (!currentEvent) {
            return { error: 'Event does not exist' };
        }

        const name = (formData.get('name') as string) || currentEvent.name;
        const imageFile = formData.get('image') as File | null;
        const dateString = formData.get('date') as string;
        const venue = (formData.get('venue') as string | null) || currentEvent.venue;
        const eventDays = (formData.get('eventDays') as string | null) || currentEvent.eventDays;
        const showTime = (formData.get('showTime') as string | null) || currentEvent.showTime;
        const audienceType =
            (formData.get('audienceType') as string | null) || currentEvent.audienceType;
        const priceString = formData.get('price') as string;
        const state = formData.get('state')
            ? Number.parseInt(formData.get('state') as string)
            : currentEvent.state;
        const linkUrl = (formData.get('linkUrl') as string | null) || currentEvent.linkUrl; // Nuevo campo
        const eventCategoryId =
            (formData.get('eventCategoryId') as string) || currentEvent.eventCategoryId; // Nuevo campo

        // Validar que eventCategoryId esté presente
        if (!eventCategoryId) {
            return { error: 'Category is required' };
        }

        const dateValue = dateString ? new Date(dateString) : currentEvent.date;
        const priceValue =
            priceString && priceString.trim() !== '' ? priceString.trim() : currentEvent.price;

        const updateData: {
            name: string;
            image?: string | null;
            date: Date;
            venue: string | null;
            eventDays: string | null;
            showTime: string | null;
            audienceType: string | null;
            price: string | null;
            state: number;
            linkUrl: string | null;
            eventCategoryId: string;
        } = {
            name,
            date: dateValue,
            venue,
            eventDays,
            showTime,
            audienceType,
            price: priceValue,
            state,
            linkUrl,
            eventCategoryId,
        };

        // Solo procesar nueva imagen si se proporciona un archivo
        if (imageFile && imageFile.size > 0) {
            try {
                const newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'events',
                    prefix: 'event-',
                });

                // Si la subida fue exitosa, usar la nueva imagen
                if (newImageUrl) {
                    updateData.image = newImageUrl;

                    // Eliminar imagen anterior si existe y es diferente
                    if (currentEvent.image && currentEvent.image !== newImageUrl) {
                        await deleteFile(currentEvent.image);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        } else {
            // Obtener currentImage del formData si existe
            const currentImage = formData.get('currentImage') as string | null;
            if (currentImage) {
                updateData.image = currentImage;
            }
        }

        const response = await prisma.eventeCalendar.update({
            where: { id },
            data: updateData,
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.UPDATE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: id,
            description: `Event "${name}" updated`,
            metadata: {
                before: {
                    name: currentEvent.name,
                },
                after: {
                    name: response.name,
                },
                changes: {
                    name:
                        name !== currentEvent.name
                            ? { from: currentEvent.name, to: name }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error updating event', error);
        throw error;
    }
}

export async function toggleEventState(id: string) {
    try {
        if (!id) {
            return { error: 'Event ID is required' };
        }

        const currentEvent = await prisma.eventeCalendar.findUnique({
            where: { id },
            select: { id: true, name: true, state: true },
        });

        if (!currentEvent) {
            return { error: 'Event does not exist' };
        }

        // Toggle state: 1 → 0 or 0 → 1
        const newState = currentEvent.state === 1 ? 0 : 1;

        const response = await prisma.eventeCalendar.update({
            where: { id },
            data: { state: newState },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.UPDATE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: id,
            description: `Event "${currentEvent.name}" state changed from ${currentEvent.state === 1 ? 'Active' : 'Inactive'} to ${newState === 1 ? 'Active' : 'Inactive'}`,
            metadata: {
                eventId: id,
                name: currentEvent.name,
                previousState: currentEvent.state,
                newState: newState,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');

        return {
            success: true,
            newState: newState,
            message: `Evento ${newState === 1 ? 'activado' : 'desactivado'} correctamente`,
        };
    } catch (error) {
        console.error('Error toggling event state', error);
        throw error;
    }
}
