'use client';

import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';

dynamic;

import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteMaterial } from '@/actions/Administration/PrintedMaterials';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PrintedMaterialInterface } from '@/types/Administration/PrintedMaterials/PrintedMaterialInterface';

interface ActionCellProps {
    row: {
        original: PrintedMaterialInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditMaterialModal = dynamic(
    () => import('@/components/Modal/Administration/PrintedMaterials/EditPrintedMaterialModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const materialId = row.original.id;
    const [openEditMaterial, setOpenEditMaterial] = useState(false);

    const handleEditMaterialCloseModal = () => {
        setOpenEditMaterial(false);
    };

    const handleDelete = async (materialId: string) => {
        try {
            const success = await deleteMaterial(materialId);
            if (success) {
                refreshTable();
                toast.success('Material Eliminado', {
                    description: 'El material se ha eliminado correctamente.',
                });
            } else {
                toast.error('Error', {
                    description: 'No se pudo eliminar el material',
                });
            }
        } catch (error) {
            console.error('Error al eliminar el material', error);
            toast.error('Error', {
                description: 'Ocurrio un error al eliminar el material',
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <BtnEditCell
                        onAction={() => setOpenEditMaterial(true)}
                        label="Editar Material"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        onDelete={handleDelete}
                        label="Eliminar Material"
                        itemId={materialId}
                        permission={['Eliminar']}
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditMaterial && (
                <DynamicEditMaterialModal
                    id={materialId}
                    refreshAction={refreshTable}
                    open={openEditMaterial}
                    onCloseAction={handleEditMaterialCloseModal}
                />
            )}
        </>
    );
}

export const PrintedMaterialsColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<PrintedMaterialInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }: { column: Column<PrintedMaterialInterface> }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Nombre del Material
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = `${row.original.name}`;
            return <div className="font-medium">{name}</div>;
        },
    },
    {
        id: 'Versión',
        accessorKey: 'numberVersion',
        header: () => <div>Versión</div>,
        cell: ({ row }) => {
            const version = `${row.original.numberVersion}`;
            return <div>{version}</div>;
        },
    },
    {
        id: 'Descripción',
        accessorKey: 'description',
        header: () => <div>Descripción</div>,
        cell: ({ row }) => {
            const description = `${row.original.description}`;
            return <div>{description}</div>;
        },
    },
    {
        id: 'Link',
        accessorKey: 'link',
        header: () => <div>Url Material</div>,
        cell: ({ row }) => {
            const link = `${row.original.link}`;
            return <div>{link}</div>;
        },
    },
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
