'use client';

import { getAllPost } from '@/actions/Administration/Blogs';
import NewBlogModal from '@/components/Modal/Administration/Blogs/NewBlogModal';
import { BlogsColumns } from '@/components/Tables/Administration/Blogs/BlogsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function BlogsTable() {
    const { data: blogsData = [], isLoading, refetch: refreshTable } = useStableFetch(
        () => getAllPost(),
    );

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
