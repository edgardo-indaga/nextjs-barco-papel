import parse from 'html-react-parser';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/actions/Administration/Blogs/queries';
import { createMetaDescription } from '@/lib/utils';

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Blog no encontrado',
        };
    }

    // Crear descripción limpia sin HTML para meta tags
    const cleanDescription = createMetaDescription(blog.description, 160);

    return {
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
    };
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-8 lg:py-[100px]">
            {/* Título */}
            <h1 className="font-basic-sans text-negro md:mb-[]30px mb-6 text-center text-[28px] leading-[32px] font-bold uppercase sm:text-[32px] sm:leading-[36px] md:text-[36px] md:leading-[40px] lg:text-[40px] lg:leading-[44px]">
                {blog.name}
            </h1>

            {/* Categoría */}
            <div className="mb-4 flex justify-center md:mb-6">
                <span className="font-basic-sans text-center text-[18px] font-semibold text-[#f50a86] uppercase sm:text-[20px] md:text-[22px]">
                    {blog.primaryCategory.name}
                </span>
            </div>

            {/* Fecha */}
            <div className="mb-4 flex justify-center md:mb-6">
                <p className="font-basic-sans text-negro mr-2 text-[16px] font-light uppercase sm:text-[17px] md:text-[18px]">
                    {blog.createdAt}
                </p>
            </div>

            {/* Metadata del autor */}
            <div className="mb-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:mb-[70px]">
                <div className="flex items-center justify-center">
                    <span className="font-basic-sans text-negro mr-2 text-[16px] font-light sm:text-[17px] md:text-[18px]">
                        Por
                    </span>
                    <span className="font-basic-sans text-negro text-[16px] font-light sm:text-[17px] md:text-[18px]">
                        {blog.author}
                    </span>
                </div>
            </div>

            {/* Imagen principal */}
            {blog.image && (
                <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-[12px] border-2 border-black sm:h-[400px] md:mb-10 md:h-[500px] lg:h-[600px]">
                    <Image
                        src={blog.image}
                        alt={blog.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Contenido del artículo */}
            <div className="prose prose-lg max-w-none">
                <div className="font-basic-sans text-negro text-center text-[16px] leading-[24px] font-light sm:text-[17px] sm:leading-[26px] md:text-[18px] md:leading-[28px] [&>h1]:mb-4 [&>h1]:text-[24px] [&>h1]:font-bold [&>h2]:mb-3 [&>h2]:text-[22px] [&>h2]:font-semibold [&>h3]:mb-2 [&>h3]:text-[20px] [&>h3]:font-medium [&>img]:my-6 [&>img]:h-auto [&>img]:w-full [&>img]:rounded-lg [&>img]:border-2 [&>img]:border-black [&>p]:mb-4 [&>span]:inline">
                    {parse(blog.description)}
                </div>
            </div>

            {/* Botón de regreso */}
            <div className="mt-8 border-t border-gray-200 pt-8 md:mt-[100px] md:pt-12">
                <a
                    href="/blogs"
                    className="font-basic-sans bg-negro text-fucsia hover:bg-fucsia hover:text-negro inline-flex items-center rounded-lg px-[30px] py-[10px] text-[16px] font-normal transition-colors md:text-[18px]"
                >
                    ← Volver a Noticias
                </a>
            </div>
        </div>
    );
}
