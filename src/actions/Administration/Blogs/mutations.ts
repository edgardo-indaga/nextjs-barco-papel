'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';

function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(name: string, blogId?: string): Promise<string> {
    const baseSlug = createSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existingBlog = await prisma.blog.findFirst({
            where: {
                slug,
                id: blogId ? { not: blogId } : undefined,
            },
        });

        if (!existingBlog) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

export async function createPost(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const primaryCategoryId = formData.get('primaryCategoryId') as string;
        const author = formData.get('author') as string;
        const description = formData.get('description') as string;

        if (!name || !primaryCategoryId || !author || !description) {
            return { error: 'Required fields are missing' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'blog',
                    prefix: 'post-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const slug = await generateUniqueSlug(name);

        const response = await prisma.blog.create({
            data: {
                name,
                slug,
                primaryCategoryId,
                author,
                description,
                image: imageUrl,
            },
            include: {
                primaryCategory: true,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.CREATE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: response.id,
            description: `Post "${name}" created`,
            metadata: {
                blogId: response.id,
                data: {
                    name,
                    primaryCategoryId,
                    author,
                    description,
                    image: imageUrl,
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
        console.error('Error creating Post', error);
        throw error;
    }
}

export async function deletePost(id: string) {
    try {
        if (!id) {
            return { error: 'Post ID is requeried' };
        }

        const blogToDelete = await prisma.blog.findUnique({
            where: { id },
        });

        if (!blogToDelete) {
            return { error: 'Post does not exist' };
        }

        // Eliminar la imagen si existe
        if (blogToDelete.image) {
            await deleteFile(blogToDelete.image);
        }

        const response = await prisma.blog.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.DELETE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: id,
            description: `Post "${blogToDelete.name}" deleted`,
            metadata: {
                postId: id,
                name: blogToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error deleting Post', error);
        throw error;
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Post ID is required' };
        }

        const currentPost = await prisma.blog.findUnique({
            where: { id },
        });

        if (!currentPost) {
            return { error: 'Post does not exist' };
        }

        const name = (formData.get('name') as string) || currentPost.name;
        const primaryCategoryId =
            (formData.get('primaryCategoryId') as string) || currentPost.primaryCategoryId;
        const author = (formData.get('author') as string) || currentPost.author;
        const description = (formData.get('description') as string) || currentPost.description;
        const imageFile = formData.get('image') as File | null;
        const currentImage = formData.get('currentImage') as string | null;

        const updateData: {
            name: string;
            slug?: string;
            primaryCategoryId: string;
            author: string;
            description: string;
            image?: string | null;
        } = { name, primaryCategoryId, author, description };

        // Si el nombre cambió, generar nuevo slug
        if (name !== currentPost.name) {
            updateData.slug = await generateUniqueSlug(name, id);
        }

        // Solo procesar nueva imagen si se proporciona un archivo
        if (imageFile && imageFile.size > 0) {
            try {
                const newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'blog',
                    prefix: 'post-',
                });

                // Si la subida fue exitosa, usar la nueva imagen
                if (newImageUrl) {
                    updateData.image = newImageUrl;

                    // Eliminar imagen anterior si existe y es diferente
                    if (currentPost.image && currentPost.image !== newImageUrl) {
                        await deleteFile(currentPost.image);
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

        const response = await prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                primaryCategory: true,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.UPDATE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: id,
            description: `Post "${name}" updated`,
            metadata: {
                before: {
                    name: currentPost.name,
                    image: currentPost.image,
                    primaryCategoryId: currentPost.primaryCategoryId,
                    author: currentPost.author,
                    description: currentPost.description,
                },
                after: {
                    name: response.name,
                    image: response.image,
                    primaryCategoryId: response.primaryCategoryId,
                    author: response.author,
                    description: response.description,
                },
                changes: {
                    name:
                        name !== currentPost.name
                            ? { from: currentPost.name, to: name }
                            : undefined,
                    image: currentImage ? { from: currentPost.image, to: currentImage } : undefined,
                    primaryCategoryId:
                        primaryCategoryId !== currentPost.primaryCategoryId
                            ? { from: currentPost.primaryCategoryId, to: primaryCategoryId }
                            : undefined,
                    author:
                        author !== currentPost.author
                            ? { from: currentPost.author, to: author }
                            : undefined,
                    description:
                        description !== currentPost.description
                            ? { from: currentPost.description, to: description }
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
        console.error('Error updating post', error);
        throw error;
    }
}
