'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllCategories } from '@/actions/Administration/Categories';
import NewCategoryModal from '@/components/Modal/Administration/Categories/NewCategoryModal';
import { CategoriesColumns } from '@/components/Tables/Administration/Categories/CategoriesColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

export default function CategoriesTable() {
    const [categoriesData, setCategoriesData] = useState<CategoryInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllCategories();
            setCategoriesData(data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener las categorias', error);
            const message = error instanceof Error ? error.message : 'Ocurrio un error desconocido';
            setError(`Error al obtener las categorias ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const refreshTable = async () => {
        await fetchCategories();
    };

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
                    <NewCategoryModal refreshAction={fetchCategories} />
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
