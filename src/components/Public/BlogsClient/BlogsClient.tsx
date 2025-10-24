'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { getBlogsWithFilter, getTotalBlogsCount } from '@/actions/Administration/Blogs/queries';
import { getCategoryBySlug } from '@/actions/Administration/Categories/queries';
import CategoryFilter from '@/components/Home/CategoryFilter/CategoryFilter';
import Paginator from '@/components/Home/Paginator/Paginator';
import { generateCategorySlug } from '@/lib/utils/categoryUtils';
import type { BlogInterface } from '@/types/Administration/Blogs/BlogInterface';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

interface BlogsClientProps {
    initialCategories: CategoryInterface[];
    initialBlogs: BlogInterface[];
    initialSelectedCategoryId: string | null;
    initialCurrentPage: number;
    initialTotalPages: number;
}

export default function BlogsClient({
    initialCategories,
    initialBlogs,
    initialSelectedCategoryId,
    initialCurrentPage,
    initialTotalPages,
}: BlogsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Estado para mostrar datos actuales
    const [categories] = useState(initialCategories);
    const [blogs, setBlogs] = useState(initialBlogs);
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialSelectedCategoryId);
    const [currentPage, setCurrentPage] = useState(initialCurrentPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [loading, setLoading] = useState(false);

    // Efecto para actualizar datos cuando cambian los parámetros de URL
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const pageParam = searchParams.get('page');

        const newCurrentPage = Number.parseInt(pageParam || '1');

        // Convertir slug de categoría a ID si existe
        const loadCategoryData = async () => {
            let newCategoryId: string | null = null;

            if (categoryParam) {
                const category = await getCategoryBySlug(categoryParam);
                newCategoryId = category?.id || null;
            }

            // Solo actualizar si los parámetros realmente cambiaron
            if (newCategoryId !== selectedCategoryId || newCurrentPage !== currentPage) {
                setSelectedCategoryId(newCategoryId);
                setCurrentPage(newCurrentPage);

                // Cargar nuevos datos
                loadData(newCategoryId, newCurrentPage);
            }
        };

        loadCategoryData();
    }, [searchParams, selectedCategoryId, currentPage]);

    const loadData = async (categoryId: string | null, page: number) => {
        try {
            setLoading(true);
            const offset = (page - 1) * 12;

            const [blogsData, totalCount] = await Promise.all([
                getBlogsWithFilter(categoryId || undefined, offset, 12),
                getTotalBlogsCount(categoryId || undefined),
            ]);

            setBlogs(blogsData);
            setTotalPages(Math.ceil(totalCount / 12));
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: string | null) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);

            if (categoryId) {
                // Encontrar la categoría por ID y usar su slug
                const category = categories.find((cat) => cat.id === categoryId);
                if (category) {
                    const categorySlug = generateCategorySlug(category.name);
                    params.set('category', categorySlug);
                }
            } else {
                params.delete('category');
            }

            // Resetear a página 1
            params.delete('page');

            const url = params.toString() ? `/blogs?${params.toString()}` : '/blogs';
            router.push(url);
        });
    };

    const handlePageChange = (page: number) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);

            if (page > 1) {
                params.set('page', page.toString());
            } else {
                params.delete('page');
            }

            const url = params.toString() ? `/blogs?${params.toString()}` : '/blogs';
            router.push(url);

            // Scroll al inicio para mejorar UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    return (
        <>
            {/* Filtros de categoría */}
            <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
            />

            {/* Indicador de carga durante transiciones o cargas de datos */}
            {(isPending || loading) && (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f50a86] border-t-transparent"></div>
                </div>
            )}

            {/* Grid de noticias */}
            {!isPending && !loading && (
                <>
                    {blogs.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="font-basic-sans text-[18px] text-[#575756]">
                                No se encontraron noticias para esta categoria.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                                {blogs.map((blog) => (
                                    <article key={blog.id} className="group">
                                        {/* Categoria */}
                                        <div className="mb-[8px] md:mb-[10px]">
                                            <h3 className="font-basic-sans text-[16px] font-semibold text-[#f50a86] uppercase sm:text-[17px] md:text-[18px]">
                                                {blog.primaryCategory.name}
                                            </h3>
                                        </div>

                                        {/* Imagen */}
                                        {blog.image && (
                                            <Link href={`/blogs/${blog.slug}`}>
                                                <div className="relative h-[200px] w-full overflow-hidden rounded-[10px] border-2 border-black transition-transform duration-200 group-hover:scale-[1.02] sm:h-[240px] md:h-[280px]">
                                                    <Image
                                                        src={blog.image}
                                                        alt={blog.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        )}

                                        {/* Contenido */}
                                        <div className="px-[4px] py-[12px] sm:px-[5px] sm:py-[14px] md:px-[6px] md:py-[16px]">
                                            {/* Titulo */}
                                            <h2 className="font-basic-sans text-negro mb-3 text-[18px] leading-[22px] font-normal transition-colors duration-200 group-hover:text-[#f50a86] sm:text-[19px] sm:leading-[23px] md:text-[20px] md:leading-[24px]">
                                                <Link href={`/blogs/${blog.slug}`}>
                                                    {blog.name}
                                                </Link>
                                            </h2>

                                            {/* Autor */}
                                            <div className="flex flex-row py-[10px] sm:py-[12px] md:py-[15px]">
                                                <h4 className="font-basic-sans text-negro mr-[5px] text-[16px] leading-[16px] font-normal sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Por:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    {blog.author}
                                                </h4>
                                            </div>

                                            {/* Fecha */}
                                            <div>
                                                <p className="font-basic-sans text-[13px] leading-[13px] text-[#575756] sm:text-[13.5px] sm:leading-[13.5px] md:text-[14px] md:leading-[14px]">
                                                    {blog.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Paginador */}
                            <Paginator
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
}
