'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllEvents } from '@/actions/Administration/EventCalendars';
import NewEventCalendarModal from '@/components/Modal/Administration/EventCalendars/NewEventCalendarModal';
import { EventCalendarsColumns } from '@/components/Tables/Administration/EventCalendars/EventCalendarsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';

export default function EventCalendarsTable() {
    const [eventsData, setEventsData] = useState<EventeCalendarInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllEvents();

            const transformedData = data.map((event) => ({
                id: event.id,
                name: event.name,
                date: event.date,
                venue: event.venue,
                eventDays: event.eventDays,
                showTime: event.showTime,
                price: event.price,
                state: event.state,
                eventCategoryId: event.eventCategoryId,
                eventCategory: event.eventCategory, // Incluir la categoría completa
                createdAt: event.createdAt,
            }));
            setEventsData(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los Eventos', error);
            const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
            setError(`Error al obtener los eventos ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const refreshTable = async () => {
        await fetchEvents();
    };

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
