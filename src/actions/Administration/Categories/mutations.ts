'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get('name') as string;

        if (!name) {
            return { error: 'Category name required' };
        }

        const response = await prisma.category.create({
            data: { name },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.CATEGORY.CREATE,
            entity: AUDIT_ENTITIES.CATEGORY,
            entityId: response.id,
            description: `Role "${name}" created`,
            metadata: { categoryName: name, categoryId: response.id },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error creating category', error);
        throw error;
    }
}

export async function deleteCategory(id: string) {
    try {
        if (!id) {
            return { error: 'Category not found' };
        }

        const categoryToDelete = await prisma.category.findUnique({
            where: { id: id },
        });

        if (!categoryToDelete) {
            return { error: 'Category does not exist' };
        }

        const response = await prisma.category.deleteMany({
            where: { id: id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.CATEGORY.DELETE,
            entity: AUDIT_ENTITIES.CATEGORY,
            entityId: id,
            description: `Category "${categoryToDelete.name}" deleted`,
            metadata: {
                categoryId: id,
                name: categoryToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error delete category', error);
        throw error;
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Category ID is required' };
        }

        const currentCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!currentCategory) {
            return { error: 'Category dows not exist' };
        }

        const name = (formData.get('name') as string) || currentCategory.name;

        const updateData: { name: string } = { name };

        const response = await prisma.category.update({
            where: { id },
            data: updateData,
        });

        // Registrar la actualización en el sistema de auditoría
        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.CATEGORY.UPDATE,
            entity: AUDIT_ENTITIES.CATEGORY,
            entityId: id,
            description: `Category "${currentCategory.name}" updated`,
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

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error updating category', error);
        throw error;
    }
}
