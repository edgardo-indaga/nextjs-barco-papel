'use server';

import prisma from '@/lib/db/db';
import type {
    BlogInterface,
    BlogUniqueInterface,
} from '@/types/Administration/Blogs/BlogInterface';

// Crear el formateador de fechas como constante para reutilización
const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export async function getAllPost(): Promise<BlogInterface[]> {
    try {
        const response = await prisma.blog.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                author: true,
                primaryCategoryId: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                BlogCategory: {
                    select: {
                        id: true,
                        blogId: true,
                        categoryId: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Mapear y formatear las fechas usando el formateador reutilizable
        return response.map((blog) => ({
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        }));
    } catch (error) {
        console.error('Error fetching blog', error);
        throw error;
    }
}

export async function getPostById(id: string): Promise<BlogUniqueInterface | null> {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                primaryCategoryId: true,
                author: true,
                description: true,
                createdAt: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!blog) return null;

        return {
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        };
    } catch (error) {
        console.error(`Error fetching blog post with ID ${id}:`, error);
        throw error;
    }
}

export async function getPostFromHome(offset = 0, limit = 6): Promise<BlogInterface[]> {
    try {
        console.log('🔍 Fetching blog posts for home - offset:', offset, 'limit:', limit);

        const response = await prisma.blog.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                author: true,
                primaryCategoryId: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                BlogCategory: {
                    select: {
                        id: true,
                        blogId: true,
                        categoryId: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: limit,
        });

        console.log('📰 Blog posts found:', response.length);

        // Validar que hay resultados
        if (!response || response.length === 0) {
            console.log('⚠️ No blog posts found in database');
            return [];
        }

        // Mapear y formatear las fechas usando el formateador reutilizable
        const formattedPosts = response.map((blog) => ({
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        }));

        console.log('✅ Blog posts processed successfully:', formattedPosts.length);
        return formattedPosts;
    } catch (error) {
        console.error('❌ Error fetching blog posts for home:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });

        // Retornar array vacío en lugar de throw para evitar crashes en producción
        return [];
    }
}

export async function getBlogsWithFilter(
    categoryId?: string,
    offset = 0,
    limit = 12,
): Promise<BlogInterface[]> {
    try {
        const response = await prisma.blog.findMany({
            where: categoryId
                ? {
                      OR: [
                          { primaryCategoryId: categoryId },
                          {
                              BlogCategory: {
                                  some: { categoryId },
                              },
                          },
                      ],
                  }
                : undefined,
            select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                author: true,
                primaryCategoryId: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                BlogCategory: {
                    select: {
                        id: true,
                        blogId: true,
                        categoryId: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: limit,
        });

        return response.map((blog) => ({
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        }));
    } catch (error) {
        console.error('Error fetching filtered blog posts:', error);
        throw error;
    }
}

export async function getBlogBySlug(slug: string): Promise<BlogUniqueInterface | null> {
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                primaryCategoryId: true,
                author: true,
                description: true,
                createdAt: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!blog) return null;

        return {
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        };
    } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        throw error;
    }
}

export async function getTotalBlogsCount(categoryId?: string): Promise<number> {
    try {
        return await prisma.blog.count({
            where: categoryId
                ? {
                      OR: [
                          { primaryCategoryId: categoryId },
                          {
                              BlogCategory: {
                                  some: { categoryId },
                              },
                          },
                      ],
                  }
                : undefined,
        });
    } catch (error) {
        console.error('Error fetching total blogs count:', error);
        throw error;
    }
}
