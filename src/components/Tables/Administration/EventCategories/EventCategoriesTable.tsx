'use client';

import { getAllEventCategories } from '@/actions/Administration/EventCategories';
import NewEventCategoryModal from '@/components/Modal/Administration/EventCategories/NewEventCategoryModal';
import { EventCategoriesColumns } from '@/components/Tables/Administration/EventCategories/EventCategoriesColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function EventCategoriesTable() {
    const {
        data: eventCategoriesData = [],
        isLoading,
        refetch: refreshTable,
    } = useStableFetch(() => getAllEventCategories());

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Categorías de Eventos
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewEventCategoryModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={EventCategoriesColumns(refreshTable)}
                    data={eventCategoriesData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
