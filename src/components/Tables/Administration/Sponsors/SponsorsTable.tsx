'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllSponsors } from '@/actions/Administration/Sponsors';
import NewSponsorModal from '@/components/Modal/Administration/Sponsors/NewSponsorModal';
import { SponsorsColumns } from '@/components/Tables/Administration/Sponsors/SponsorsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { SponsorsInterface } from '@/types/Administration/Sponsors/SponsorsInterface';

export default function SponsorsTable() {
    const [sponsorsData, setSponsorsData] = useState<SponsorsInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchSponsors = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllSponsors();

            const transformedData = data.map((sponsor) => ({
                id: sponsor.id,
                name: sponsor.name,
                link: sponsor.link,
            }));
            setSponsorsData(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los Sponsors', error);
            const message = error instanceof Error ? error.message : 'Ocurrio un error desconocido';
            setError(`Error al obtener los sponsors ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSponsors();
    }, [fetchSponsors]);

    const refreshTable = async () => {
        await fetchSponsors();
    };

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
