'use client';

import { getAllSponsors } from '@/actions/Administration/Sponsors';
import NewSponsorModal from '@/components/Modal/Administration/Sponsors/NewSponsorModal';
import { SponsorsColumns } from '@/components/Tables/Administration/Sponsors/SponsorsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function SponsorsTable() {
    const { data: sponsorsData = [], isLoading, refetch: refreshTable } = useStableFetch(
        () => getAllSponsors(),
    );

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Patrocinadores
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewSponsorModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={SponsorsColumns(refreshTable)}
                    data={sponsorsData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
