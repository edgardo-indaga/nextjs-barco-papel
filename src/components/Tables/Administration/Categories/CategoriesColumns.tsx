'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteCategory } from '@/actions/Administration/Categories';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

interface ActionCellProps {
    row: {
        original: CategoryInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditCategoryModal = dynamic(
    () => import('@/components/Modal/Administration/Categories/EditCategoryModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const categoryId = row.original.id;
    const [openEditCategory, setOpenEditCategory] = useState(false);

    const handleEditCategoryCloseModal = () => {
        setOpenEditCategory(false);
    };

    const handleDelete = async (categoryId: string) => {
        try {
            const response = await deleteCategory(categoryId);
            if ('error' in response) {
                toast.error('Error', {
                    description: response.error,
                });
                return;
            }
            refreshTable();
            toast.success('Categoría Eliminada', {
                description: 'La categoría ha sido eliminada correctamente.',
            });
        } catch (error) {
            toast.error('Error al Eliminar Categoría', {
                description: 'Hubo un error al intentar eliminar la categoría.',
            });
            console.error('Error deleting category:', error);
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
                        onAction={() => setOpenEditCategory(true)}
                        label="Editar categoría"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        itemId={categoryId}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar categoría"
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditCategory && (
                <DynamicEditCategoryModal
                    id={categoryId}
                    open={openEditCategory}
                    onCloseAction={handleEditCategoryCloseModal}
                    refreshAction={refreshTable}
                />
            )}
        </>
    );
}

export const CategoriesColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<CategoryInterface>[] => [
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
