'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
    getEventMonth,
    getEventMonthLimited,
} from '@/actions/Administration/EventCalendars/queries';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';

// Función para obtener la abreviación del mes en español
function getMonthAbbreviation(dateString: string): string {
    const monthMap: { [key: string]: string } = {
        enero: 'ENE',
        febrero: 'FEB',
        marzo: 'MAR',
        abril: 'ABR',
        mayo: 'MAY',
        junio: 'JUN',
        julio: 'JUL',
        agosto: 'AGO',
        septiembre: 'SEP',
        octubre: 'OCT',
        noviembre: 'NOV',
        diciembre: 'DIC',
    };

    // La fecha viene en formato "día de mes" (ej: "15 de enero")
    const monthName = dateString.split(' ').pop()?.toLowerCase() || '';
    return monthMap[monthName] || 'MES';
}

export default function Cartelera() {
    const [limitedEvents, setLimitedEvents] = useState<EventeCalendarInterface[]>([]);
    const [allEvents, setAllEvents] = useState<EventeCalendarInterface[]>([]);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const limited = await getEventMonthLimited(6);
                setLimitedEvents(limited);
            } catch (error) {
                console.error('Error cargando eventos:', error);
            }
        };

        loadEvents();
    }, []);

    const handleShowAllEvents = async () => {
        if (!showAllEvents && allEvents.length === 0) {
            try {
                setLoading(true);
                const all = await getEventMonth();
                setAllEvents(all);
                setLoading(false);
            } catch (error) {
                console.error('Error cargando todos los eventos:', error);
                setLoading(false);
            }
        }
        setShowAllEvents(!showAllEvents);
    };

    const eventsToShow = showAllEvents ? allEvents : limitedEvents;
    const hasMoreEvents = limitedEvents.length >= 6;

    return (
        <>
            {limitedEvents.length === 0 && !loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-lg text-gray-600">No hay eventos disponibles</div>
                </div>
            ) : (
                <>
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-12 md:gap-8 lg:grid-cols-3">
                        {eventsToShow.map((event) => (
                            <article
                                key={event.id}
                                className="flex h-[520px] flex-col sm:h-[580px] md:h-[640px]"
                            >
                                <div className="mb-[8px] md:mb-[10px]">
                                    <h3 className="font-basic-sans text-negro text-[16px] font-semibold sm:text-[17px] md:text-[18px]">
                                        {event.eventCategory?.name || 'Sin categoría'}
                                    </h3>
                                </div>

                                {event.image ? (
                                    <div className="relative h-[200px] w-full overflow-hidden rounded-[10px] border-2 border-black sm:h-[240px] md:h-[280px]">
                                        <Image
                                            src={event.image}
                                            alt={event.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative flex h-[200px] w-full items-center justify-center rounded-[10px] border-2 border-black bg-gray-200 sm:h-[240px] md:h-[280px]">
                                        <div className="p-4 text-center">
                                            <div className="mb-2 text-3xl font-bold text-gray-600 sm:text-4xl">
                                                📅
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase sm:text-sm">
                                                Evento
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col px-[4px] py-[12px] sm:px-[5px] sm:py-[14px] md:px-[6px] md:py-[16px]">
                                    <div className="flex-1">
                                        <h2 className="font-basic-sans text-negro mb-[12px] h-[50px] text-[18px] leading-[22px] font-normal sm:text-[19px] sm:leading-[23px] md:mb-[15px] md:text-[20px] md:leading-[24px]">
                                            {event.name.length > 60
                                                ? `${event.name.substring(0, 63)}...`
                                                : event.name}
                                        </h2>

                                        {event.venue && event.venue !== '' && (
                                            <div className="flex flex-row py-[3px] sm:py-[4px] md:py-[5px]">
                                                <h4 className="font-basic-sans mr-[5px] text-[16px] leading-[16px] font-normal text-[#575756] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Lugar:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    {event.venue}
                                                </h4>
                                            </div>
                                        )}

                                        {event.eventDays && event.eventDays !== '' && (
                                            <div className="flex flex-row py-[3px] sm:py-[4px] md:py-[5px]">
                                                <h4 className="font-basic-sans mr-[5px] text-[16px] leading-[16px] font-normal text-[#575756] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Día/s:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    {event.eventDays}
                                                </h4>
                                            </div>
                                        )}

                                        {event.showTime && event.showTime !== 'Sin hora' && (
                                            <div className="flex flex-row py-[3px] sm:py-[4px] md:py-[5px]">
                                                <h4 className="font-basic-sans mr-[5px] text-[16px] leading-[16px] font-normal text-[#575756] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Hora:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    {event.showTime}
                                                </h4>
                                            </div>
                                        )}

                                        {event.audienceType && event.audienceType !== '' && (
                                            <div className="flex flex-row py-[3px] sm:py-[4px] md:py-[5px]">
                                                <h4 className="font-basic-sans mr-[5px] text-[16px] leading-[16px] font-normal text-[#575756] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Público:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    {event.audienceType}
                                                </h4>
                                            </div>
                                        )}

                                        {event.price && event.price !== '' && (
                                            <div className="flex flex-row py-[3px] sm:py-[4px] md:py-[5px]">
                                                <h4 className="font-basic-sans mr-[5px] text-[16px] leading-[16px] font-normal text-[#575756] sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    Costo:
                                                </h4>
                                                <h4 className="font-basic-sans text-negro text-[16px] leading-[16px] font-normal italic sm:text-[17px] sm:leading-[17px] md:text-[18px] md:leading-[18px]">
                                                    ${event.price}
                                                </h4>
                                            </div>
                                        )}
                                    </div>

                                    {event.linkUrl && event.linkUrl !== '' && (
                                        <div className="mt-auto flex justify-center pt-[20px] sm:pt-[25px] md:pt-[30px]">
                                            <a
                                                href={event.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-negro text-fucsia hover:bg-fucsia hover:text-negro inline-block rounded-lg px-[20px] py-[8px] text-[16px] leading-[16px] font-medium transition-colors sm:px-[22px] sm:py-[9px] sm:text-[17px] sm:leading-[17px] md:px-[24px] md:py-[10px] md:text-[18px] md:leading-[18px]"
                                            >
                                                Ir al sitio web
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {hasMoreEvents && (
                        <div className="mt-6 flex justify-center sm:mt-8 md:mt-[70px]">
                            <button
                                type="button"
                                onClick={handleShowAllEvents}
                                disabled={loading}
                                className="bg-fucsia text-negro hover:bg-negro hover:text-fucsia font-basic-sans cursor-pointer rounded-[10px] px-[20px] py-[8px] text-[16px] leading-[16px] font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-[22px] sm:py-[9px] sm:text-[17px] sm:leading-[17px] md:px-[24px] md:py-[10px] md:text-[18px] md:leading-[18px]"
                            >
                                {loading
                                    ? 'Cargando...'
                                    : showAllEvents
                                      ? 'Cargar menos'
                                      : 'Cargar más'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
