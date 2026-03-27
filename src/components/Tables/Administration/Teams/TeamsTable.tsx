'use client';

import { getAllTeams } from '@/actions/Administration/Teams';
import NewTeamModal from '@/components/Modal/Administration/Teams/NewTeamModal';
import { TeamsColumns } from '@/components/Tables/Administration/Teams/TeamsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function TeamsTable() {
    const { data: teamsData = [], isLoading, refetch: refreshTable } = useStableFetch(
        () => getAllTeams(),
    );

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Miembro del Equipo
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewTeamModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={TeamsColumns(refreshTable)}
                    data={teamsData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
