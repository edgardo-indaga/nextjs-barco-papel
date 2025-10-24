'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';

export async function createEventCategory(formData: FormData) {
    try {
        const name = formData.get('name') as string;

        if (!name || name.trim() === '') {
            return { error: 'Category name is required' };
        }

        // Verificar si ya existe una categoría con el mismo nombre
        const existingCategory = await prisma.eventCategories.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive',
                },
            },
        });

        if (existingCategory) {
            return { error: 'A category with this name already exists' };
        }

        const response = await prisma.eventCategories.create({
            data: {
                name: name.trim(),
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENT_CATEGORIES?.CREATE || 'CREATE_EVENT_CATEGORY',
            entity: AUDIT_ENTITIES.EVENT_CATEGORIES || 'EVENT_CATEGORIES',
            entityId: response.id,
            description: `Event Category "${name}" created`,
            metadata: {
                categoryId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/event-categories');
        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error creating event category', error);
        throw error;
    }
}

export async function updateEventCategory(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Category ID is required' };
        }

        const currentCategory = await prisma.eventCategories.findUnique({
            where: { id },
        });

        if (!currentCategory) {
            return { error: 'Category does not exist' };
        }

        const name = formData.get('name') as string;

        if (!name || name.trim() === '') {
            return { error: 'Category name is required' };
        }

        // Verificar si ya existe otra categoría con el mismo nombre
        const existingCategory = await prisma.eventCategories.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive',
                },
                NOT: {
                    id: id,
                },
            },
        });

        if (existingCategory) {
            return { error: 'A category with this name already exists' };
        }

        const response = await prisma.eventCategories.update({
            where: { id },
            data: {
                name: name.trim(),
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENT_CATEGORIES?.UPDATE || 'UPDATE_EVENT_CATEGORY',
            entity: AUDIT_ENTITIES.EVENT_CATEGORIES || 'EVENT_CATEGORIES',
            entityId: id,
            description: `Event Category "${name}" updated`,
            metadata: {
                before: {
                    name: currentCategory.name,
                },
                after: {
                    name: response.name,
                },
                changes: {
                    name:
                        name !== currentCategory.name
                            ? { from: currentCategory.name, to: name }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/event-categories');
        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error updating event category', error);
        throw error;
    }
}

export async function deleteEventCategory(id: string) {
    try {
        if (!id) {
            return { error: 'Category not found' };
        }

        const categoryToDelete = await prisma.eventCategories.findUnique({
            where: { id },
            include: {
                EventeCalendar: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!categoryToDelete) {
            return { error: 'Category does not exist' };
        }

        // Verificar si hay eventos usando esta categoría
        if (categoryToDelete.EventeCalendar.length > 0) {
            return {
                error: `Cannot delete category. There are ${categoryToDelete.EventeCalendar.length} events using this category.`,
            };
        }

        const response = await prisma.eventCategories.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENT_CATEGORIES?.DELETE || 'DELETE_EVENT_CATEGORY',
            entity: AUDIT_ENTITIES.EVENT_CATEGORIES || 'EVENT_CATEGORIES',
            entityId: id,
            description: `Event Category "${categoryToDelete.name}" deleted`,
            metadata: {
                categoryId: id,
                name: categoryToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/event-categories');
        revalidatePath('/admin/administration/events');

        return response;
    } catch (error) {
        console.error('Error deleting event category', error);
        throw error;
    }
}
