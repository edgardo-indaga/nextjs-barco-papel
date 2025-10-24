'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllPost } from '@/actions/Administration/Blogs';
import NewBlogModal from '@/components/Modal/Administration/Blogs/NewBlogModal';
import { BlogsColumns } from '@/components/Tables/Administration/Blogs/BlogsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { BlogInterface } from '@/types/Administration/Blogs/BlogInterface';

export default function BlogsTable() {
    const [blogsData, setBlogsData] = useState<BlogInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllPost();
            setBlogsData(data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los blogs', error);
            const message = error instanceof Error ? error.message : 'Ocurrio un error desconocido';
            setError(`Error al obtener los blogs ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const refreshTable = async () => {
        await fetchBlogs();
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Blogs
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewBlogModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={BlogsColumns(refreshTable)}
                    data={blogsData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
