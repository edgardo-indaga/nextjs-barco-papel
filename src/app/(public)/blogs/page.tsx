import Image from 'next/image';
import { getBlogsWithFilter, getTotalBlogsCount } from '@/actions/Administration/Blogs/queries';
import { getAllCategories, getCategoryBySlug } from '@/actions/Administration/Categories/queries';
import BlogsClient from '@/components/Public/BlogsClient/BlogsClient';

interface BlogsPageProps {
    searchParams: Promise<{
        category?: string;
        page?: string;
    }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
    const imageHeader = '/image-header-page.png';
    const footerBarc = '/footer-azul-solo.png';

    // Obtener parámetros de búsqueda
    const params = await searchParams;
    const categorySlug = params.category || null;
    const currentPage = Number.parseInt(params.page || '1');
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    // Convertir slug de categoría a ID si existe
    let selectedCategoryId: string | null = null;
    if (categorySlug) {
        const category = await getCategoryBySlug(categorySlug);
        selectedCategoryId = category?.id || null;
    }

    // Cargar datos en el servidor (más rápido)
    const [categories, blogsData, totalCount] = await Promise.all([
        getAllCategories(),
        getBlogsWithFilter(selectedCategoryId || undefined, offset, limit),
        getTotalBlogsCount(selectedCategoryId || undefined),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <main className="bg-web">
            <section className="h-[200px] sm:h-[240px] md:h-[299px]">
                <Image
                    src={imageHeader}
                    alt="Imagen Header Page"
                    width={2200}
                    height={299}
                    className="h-full w-full object-cover object-top"
                    priority
                />
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Componente cliente para interactividad */}
                <BlogsClient
                    initialCategories={categories}
                    initialBlogs={blogsData}
                    initialSelectedCategoryId={selectedCategoryId}
                    initialCurrentPage={currentPage}
                    initialTotalPages={totalPages}
                />
            </div>

            <div>
                <Image
                    src={footerBarc}
                    alt="Footer Barco"
                    width={8000}
                    height={2866}
                    className="h-auto w-[100vw]"
                />
            </div>
        </main>
    );
}
