'use client';

import { getAllTickets } from '@/actions/Settings/Tickets';
import NewTicketsModal from '@/components/Modal/Setting/Tickets/NewTicketsModal';
import { TicketColumns } from '@/components/Tables/Setting/Ticket/TicketColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function TicketTable() {
    const {
        data: ticketData = [],
        isLoading,
        error,
        refetch: refreshTable,
    } = useStableFetch(() => getAllTickets());

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Tickets
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewTicketsModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                {error && <p className="mb-4 text-red-500">{error.message}</p>}
                <DataTable
                    columns={TicketColumns(refreshTable)}
                    data={ticketData}
                    loading={isLoading}
                    filterPlaceholder="Buscar en todos los campos..."
                />
            </div>
        </>
    );
}
