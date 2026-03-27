'use client';

import { getAllCategories } from '@/actions/Administration/Categories';
import NewCategoryModal from '@/components/Modal/Administration/Categories/NewCategoryModal';
import { CategoriesColumns } from '@/components/Tables/Administration/Categories/CategoriesColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function CategoriesTable() {
    const { data: categoriesData = [], isLoading, refetch: refreshTable } = useStableFetch(
        () => getAllCategories(),
    );

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Categorías
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewCategoryModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={CategoriesColumns(refreshTable)}
                    data={categoriesData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
