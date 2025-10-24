'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteSponsor } from '@/actions/Administration/Sponsors';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SponsorsInterface } from '@/types/Administration/Sponsors/SponsorsInterface';

interface ActionCellProps {
    row: {
        original: SponsorsInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditSponsorModal = dynamic(
    () => import('@/components/Modal/Administration/Sponsors/EditSponsorModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const sponsorId = row.original.id;
    const [openEditSponsor, setOpenEditSponsor] = useState(false);

    const handleEditSponsorCloseModal = () => {
        setOpenEditSponsor(false);
    };

    const handleDelete = async (sponsorId: string) => {
        try {
            const success = await deleteSponsor(sponsorId);
            if (success) {
                refreshTable();
                toast.success('Sponsor Eliminado', {
                    description: 'El sponsor se ha eliminado correctamente.',
                });
            } else {
                toast.error('Error', {
                    description: 'No se pudo eliminar sponsor',
                });
            }
        } catch (error) {
            console.error('Error al eliminar el sponsor', error);
            toast.error('Error', {
                description: 'Hubo un error al intentar eliminar el sponsor',
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
                        onAction={() => setOpenEditSponsor(true)}
                        label="Editar Sponsor"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        onDelete={handleDelete}
                        label="Eliminar Sponsor"
                        itemId={sponsorId}
                        permission={['Eliminar']}
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditSponsor && (
                <DynamicEditSponsorModal
                    id={sponsorId}
                    refreshAction={refreshTable}
                    open={openEditSponsor}
                    onCloseAction={handleEditSponsorCloseModal}
                />
            )}
        </>
    );
}

export const SponsorsColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<SponsorsInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }: { column: Column<SponsorsInterface> }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Nombre del Sponsor
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = `${row.original.name}`;
            return <div className="font-medium">{name}</div>;
        },
    },
    {
        id: 'Link',
        accessorKey: 'link',
        header: () => <div>Url Sponsor</div>,
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
