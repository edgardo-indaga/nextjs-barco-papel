'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllTeams } from '@/actions/Administration/Teams';
import NewTeamModal from '@/components/Modal/Administration/Teams/NewTeamModal';
import { TeamsColumns } from '@/components/Tables/Administration/Teams/TeamsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';

export default function TeamsTable() {
    const [teamsData, setTeamsData] = useState<TeamsInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllTeams();

            const transformedData = data.map((team) => ({
                id: team.id,
                name: team.name,
                description: team.description,
            }));
            setTeamsData(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los miembros', error);
            const message = error instanceof Error ? error.message : 'Ocurrio un error desconocido';
            setError(`Error al obtener los miembros ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const refreshTable = async () => {
        await fetchTeams();
    };

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
