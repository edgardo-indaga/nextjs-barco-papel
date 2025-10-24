'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';

interface BlogCategoryQuery {
    id: string;
    blogId: string | null;
    categoryId: string | null;
    createdAt: Date;
    category: {
        id: string;
        name: string;
    } | null;
}

export async function getBlogCategories(blogId: string): Promise<BlogCategoryQuery[]> {
    if (!blogId) {
        throw new Error('Blog ID is invalid');
    }

    try {
        return await prisma.blogCategory.findMany({
            where: {
                blogId: blogId,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error getting blog categories:', error);
        throw error;
    }
}

export async function updateBlogCategories(blogId: string, categories: string[]) {
    if (!blogId) {
        throw new Error('Blog ID is invalid');
    }

    if (
        !Array.isArray(categories) ||
        categories.some((categoryId) => typeof categoryId !== 'string')
    ) {
        throw new Error('Categories must be an array of valid IDs');
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
            select: { id: true, name: true, author: true },
        });

        if (!blog) {
            throw new Error('Blog does not exist');
        }

        const currentBlogCategories = await prisma.blogCategory.findMany({
            where: { blogId: blogId },
            include: {
                category: {
                    select: { id: true, name: true },
                },
            },
        });

        const currentCategoryIds = currentBlogCategories
            .map((bc) => bc.category?.id)
            .filter(Boolean) as string[];
        const currentCategoryNames = currentBlogCategories
            .map((bc) => bc.category?.name)
            .filter(Boolean) as string[];

        const result = await prisma.$transaction(async (tx) => {
            // Eliminar todas las categorías actuales del blog
            await tx.blogCategory.deleteMany({
                where: { blogId: blogId },
            });

            if (categories.length === 0) {
                return {
                    message: 'All categories have been removed from the blog',
                    success: true,
                };
            }

            // Verificar que todas las categorías existen
            const existingCategories = await tx.category.findMany({
                where: { id: { in: categories } },
                select: { id: true, name: true },
            });
            const validCategoryIds = existingCategories.map((c) => c.id);
            const validCategoryNames = existingCategories.map((c) => c.name);
            const invalidCategories = categories.filter(
                (categoryId) => !validCategoryIds.includes(categoryId),
            );

            if (invalidCategories.length > 0) {
                throw new Error(
                    `The following categories do not exist: ${invalidCategories.join(', ')}`,
                );
            }

            // Asignar nuevas categorías al blog
            const newBlogCategories = categories.map((categoryId) => ({
                blogId: blogId,
                categoryId,
            }));

            await tx.blogCategory.createMany({
                data: newBlogCategories,
            });

            return {
                message: 'Blog categories updated successfully',
                success: true,
                validCategoryNames,
            };
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action:
                categories.length > 0
                    ? AUDIT_ACTIONS.BLOG.ASSIGN_CATEGORIES
                    : AUDIT_ACTIONS.BLOG.REMOVE_CATEGORIES,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: blogId,
            description:
                categories.length > 0
                    ? `Categories assigned to blog "${blog.name}"`
                    : `All categories removed from blog "${blog.name}"`,
            metadata: {
                blogId: blogId,
                blogName: blog.name,
                blogAuthor: blog.author,
                before: {
                    categoryIds: currentCategoryIds,
                    categoryNames: currentCategoryNames,
                },
                after: {
                    categoryIds: categories,
                    categoryNames: result.validCategoryNames || [],
                },
                added: categories.filter((c) => !currentCategoryIds.includes(c)),
                removed: currentCategoryIds.filter((c) => !categories.includes(c)),
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return result;
    } catch (error) {
        console.error('Error updating blog categories:', error);
        throw new Error(
            `Failed to update blog categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
    }
}
