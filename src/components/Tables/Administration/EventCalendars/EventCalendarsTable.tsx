'use client';

import { getAllEvents } from '@/actions/Administration/EventCalendars';
import NewEventCalendarModal from '@/components/Modal/Administration/EventCalendars/NewEventCalendarModal';
import { EventCalendarsColumns } from '@/components/Tables/Administration/EventCalendars/EventCalendarsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function EventCalendarsTable() {
    const {
        data: eventsData = [],
        isLoading,
        refetch: refreshTable,
    } = useStableFetch(() => getAllEvents());

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Eventos
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewEventCalendarModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={EventCalendarsColumns(refreshTable)}
                    data={eventsData}
                    loading={isLoading}
                    filterPlaceholder="Buscar eventos..."
                />
            </div>
        </>
    );
}
