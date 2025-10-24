'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllEventCategories } from '@/actions/Administration/EventCategories';
import NewEventCategoryModal from '@/components/Modal/Administration/EventCategories/NewEventCategoryModal';
import { EventCategoriesColumns } from '@/components/Tables/Administration/EventCategories/EventCategoriesColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { EventCategoryInterface } from '@/types/Administration/EventCategories/EventCategoriesInterface';

export default function EventCategoriesTable() {
    const [eventCategoriesData, setEventCategoriesData] = useState<EventCategoryInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchEventCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllEventCategories();
            setEventCategoriesData(data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener las categorías de eventos', error);
            const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
            setError(`Error al obtener las categorías de eventos ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEventCategories();
    }, [fetchEventCategories]);

    const refreshTable = async () => {
        await fetchEventCategories();
    };

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
                    <NewEventCategoryModal refreshAction={fetchEventCategories} />
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
