'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteEventCategory } from '@/actions/Administration/EventCategories';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EventCategoryInterface } from '@/types/Administration/EventCategories/EventCategoriesInterface';

interface ActionCellProps {
    row: {
        original: EventCategoryInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditEventCategoryModal = dynamic(
    () => import('@/components/Modal/Administration/EventCategories/EditEventCategoryModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const eventCategoryId = row.original.id;
    const [openEditEventCategory, setOpenEditEventCategory] = useState(false);

    const handleEditEventCategoryCloseModal = () => {
        setOpenEditEventCategory(false);
    };

    const handleDelete = async (eventCategoryId: string) => {
        try {
            const response = await deleteEventCategory(eventCategoryId);
            if ('error' in response) {
                toast.error('Error', {
                    description: response.error,
                });
                return;
            }
            refreshTable();
            toast.success('Categoría de Evento Eliminada', {
                description: 'La categoría de evento ha sido eliminada correctamente.',
            });
        } catch (error) {
            toast.error('Error al Eliminar Categoría de Evento', {
                description: 'Hubo un error al intentar eliminar la categoría de evento.',
            });
            console.error('Error deleting event category:', error);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <BtnEditCell
                        onAction={() => setOpenEditEventCategory(true)}
                        label="Editar categoría de evento"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        itemId={eventCategoryId}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar categoría de evento"
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditEventCategory && (
                <DynamicEditEventCategoryModal
                    id={eventCategoryId}
                    open={openEditEventCategory}
                    onCloseAction={handleEditEventCategoryCloseModal}
                    refreshAction={refreshTable}
                />
            )}
        </>
    );
}

export const EventCategoriesColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<EventCategoryInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
