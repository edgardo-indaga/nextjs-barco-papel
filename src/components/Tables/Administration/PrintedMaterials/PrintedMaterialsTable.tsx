'use client';

import { getAllMaterial } from '@/actions/Administration/PrintedMaterials';
import NewPrintedMaterialModal from '@/components/Modal/Administration/PrintedMaterials/NewPrintedMaterialModal';
import { PrintedMaterialsColumns } from '@/components/Tables/Administration/PrintedMaterials/PrintedMaterialsColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useStableFetch } from '@/hooks/useStableFetch';

export default function PrintedMaterialsTable() {
    const { data: materialsData = [], isLoading, refetch: refreshTable } = useStableFetch(
        () => getAllMaterial(),
    );

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
