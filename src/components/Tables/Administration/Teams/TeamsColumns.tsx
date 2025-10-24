'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteTeam } from '@/actions/Administration/Teams';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';

interface ActionCellProps {
    row: {
        original: TeamsInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditTeamModal = dynamic(
    () => import('@/components/Modal/Administration/Teams/EditTeamModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const teamId = row.original.id;
    const [openEditTeam, setOpenEditTeam] = useState(false);

    const handleEditTeamCloseModal = () => {
        setOpenEditTeam(false);
    };

    const handleDelete = async (teamId: string) => {
        try {
            const success = await deleteTeam(teamId);
            if (success) {
                refreshTable();
                toast.success('Equipo Eliminado', {
                    description: 'El equipo se ha eliminado correctamente.',
                });
            } else {
                toast.error('Error', {
                    description: 'No se pudo eliminar el equipo',
                });
            }
        } catch (error) {
            console.error('Error al eliminar el equipo', error);
            toast.error('Error', {
                description: 'Ocurrió un error al eliminar el equipo',
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
                        onAction={() => setOpenEditTeam(true)}
                        label="Editar Miembro"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        onDelete={handleDelete}
                        label="Eliminar Miembro"
                        itemId={teamId}
                        permission={['Eliminar']}
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditTeam && (
                <DynamicEditTeamModal
                    id={teamId}
                    refreshAction={refreshTable}
                    open={openEditTeam}
                    onCloseAction={handleEditTeamCloseModal}
                />
            )}
        </>
    );
}

export const TeamsColumns = (refreshTable: () => Promise<void>): ColumnDef<TeamsInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }: { column: Column<TeamsInterface> }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Nombre del Miembro
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = `${row.original.name}`;
            return <div className="font-medium">{name}</div>;
        },
    },
    {
        id: 'Descripción',
        accessorKey: 'description',
        header: () => (
            <div className="flex min-w-[100px] justify-center whitespace-nowrap">Descripción</div>
        ),
        cell: ({ row }) => {
            const description = `${row.original.description}`;
            return <div>{description}</div>;
        },
    },
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
