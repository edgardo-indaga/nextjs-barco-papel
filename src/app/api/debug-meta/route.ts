import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug } from '@/actions/Administration/Blogs/queries';
import { createMetaDescription } from '@/lib/utils';

// API route para debug de meta tags
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
    }

    try {
        const blog = await getBlogBySlug(slug);

        if (!blog) {
            return NextResponse.json({ error: 'Blog no encontrado' }, { status: 404 });
        }

        // Crear descripción limpia
        const cleanDescription = createMetaDescription(blog.description, 160);

        return NextResponse.json({
            success: true,
            data: {
                slug: blog.slug,
                title: blog.name,
                originalDescription: blog.description,
                cleanDescription: cleanDescription,
                descriptionLength: cleanDescription.length,
                author: blog.author,
                image: blog.image,
                url: `https://www.barcodepapel.cl/blogs/${slug}`,
                metaTags: {
                    title: `${blog.name} | Barco de Papel`,
                    description: cleanDescription,
                    openGraph: {
                        title: blog.name,
                        description: cleanDescription,
                        images: blog.image ? [blog.image] : [],
                        url: `https://www.barcodepapel.cl/blogs/${slug}`,
                        type: 'article',
                        siteName: 'Barco de Papel',
                        locale: 'es_ES',
                        publishedTime: blog.createdAt,
                        authors: [blog.author],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: blog.name,
                        description: cleanDescription,
                        images: blog.image ? [blog.image] : [],
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error en debug-meta:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido',
            },
            { status: 500 },
        );
    }
}
