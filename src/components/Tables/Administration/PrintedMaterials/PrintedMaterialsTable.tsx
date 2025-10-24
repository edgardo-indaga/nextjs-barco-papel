'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllMaterial } from '@/actions/Administration/PrintedMaterials';
import NewPrintedMaterialModal from '@/components/Modal/Administration/PrintedMaterials/NewPrintedMaterialModal';
import { PrintedMaterialsColumns } from '@/components/Tables/Administration/PrintedMaterials/PrintedMaterialsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import type { PrintedMaterialInterface } from '@/types/Administration/PrintedMaterials/PrintedMaterialInterface';

export default function PrintedMaterialsTable() {
    const [materialsData, setMaterialsData] = useState<PrintedMaterialInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchMaterials = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllMaterial();

            const transformedData = data.map((material) => ({
                id: material.id,
                name: material.name,
                numberVersion: material.numberVersion,
                description: material.description,
                link: material.link,
                image: material.image,
            }));
            setMaterialsData(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los Materiales', error);
            const message = error instanceof Error ? error.message : 'Ocurrio un error desconocido';
            setError(`Error al obtener los materiales ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const refreshTable = async () => {
        await fetchMaterials();
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] text-[20px] leading-none font-medium tracking-tight">
                        Materiales Impresos
                    </h5>
                    <p className="text-muted-foreground text-[13px]">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewPrintedMaterialModal refreshAction={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px]">
                <DataTable
                    columns={PrintedMaterialsColumns(refreshTable)}
                    data={materialsData}
                    loading={isLoading}
                    filterPlaceholder="Buscar..."
                />
            </div>
        </>
    );
}
