'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePost } from '@/actions/Administration/Blogs';
import {
    BtnConfigCell,
    BtnDeleteCell,
    BtnEditCell,
} from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BlogInterface } from '@/types/Administration/Blogs/BlogInterface';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

interface ActionCellProps {
    row: {
        original: BlogInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditBlogModal = dynamic(
    () => import('@/components/Modal/Administration/Blogs/EditBlogModal'),
    { ssr: false },
);

const DynamicAssignCategoriesModal = dynamic(
    () => import('@/components/Modal/Administration/Blogs/AssignCategoriesModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const blogId = row.original.id;
    const [openEditBlog, setOpenEditBlog] = useState(false);
    const [openAssignCategories, setOpenAssignCategories] = useState(false);

    const handleEditBlogCloseModal = () => {
        setOpenEditBlog(false);
    };

    const handleAssignCategoriesCloseModal = () => {
        setOpenAssignCategories(false);
    };

    const handleDelete = async (blogId: string) => {
        try {
            const success = await deletePost(blogId);
            if (success) {
                refreshTable();
                toast.success('Blog Eliminado', {
                    description: 'El blog ha sido eliminado correctamente.',
                });
            } else {
                toast.error('Error', {
                    description: 'No se pudo eliminar blog',
                });
            }
        } catch (error) {
            toast.error('Error al Eliminar Blog', {
                description: 'Hubo un error al intentar eliminar el blog.',
            });
            console.error('Error deleting blog:', error);
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
                        onAction={() => setOpenEditBlog(true)}
                        label="Editar blog"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnConfigCell
                        onAction={() => setOpenAssignCategories(true)}
                        label="Asignar Categorias"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        itemId={blogId}
                        onDelete={handleDelete}
                        permission={['Eliminar']}
                        label="Eliminar blog"
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {openEditBlog && (
                <DynamicEditBlogModal
                    id={blogId}
                    open={openEditBlog}
                    onCloseAction={handleEditBlogCloseModal}
                    refreshAction={refreshTable}
                />
            )}
            {openAssignCategories && (
                <DynamicAssignCategoriesModal
                    id={blogId}
                    open={openAssignCategories}
                    onCloseAction={handleAssignCategoriesCloseModal}
                    refreshAction={refreshTable}
                />
            )}
        </>
    );
}

export const BlogsColumns = (refreshTable: () => Promise<void>): ColumnDef<BlogInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Título
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'Autor',
        accessorKey: 'author',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Autor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'Categoría Principal',
        accessorKey: 'primaryCategory.name',
        header: ({ column }) => {
            return (
                <div className="flex justify-center font-semibold whitespace-nowrap">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Categoría Principal
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div className="flex items-center justify-center">
                    {blog.primaryCategory?.name || 'N/A'}
                </div>
            );
        },
    },
    {
        id: 'Categorías Secundarias',
        header: () => (
            <div className="flex min-w-[100px] justify-center whitespace-nowrap">
                Categorías Secundarias
            </div>
        ),
        accessorFn: (row) => {
            const secondaryCategories = row.BlogCategory?.filter(
                (bc) => bc.category?.name && bc.category.name !== row.primaryCategory?.name,
            )
                ?.map((bc) => bc.category?.name)
                ?.filter(Boolean)
                ?.join(', ');
            return secondaryCategories || 'Sin categorías secundarias';
        },
        cell: ({ row }) => {
            const blog = row.original;
            const secondaryCategories = blog.BlogCategory?.map((bc) => bc.category)?.filter(
                (category): category is CategoryInterface =>
                    category !== null && category !== undefined,
            );

            if (!secondaryCategories || secondaryCategories.length === 0) {
                return <div className="text-gray-500">Sin categorías secundarias</div>;
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {secondaryCategories.map((category) => (
                        <span
                            key={`${blog.id}-${category.id}`}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                            {category.name}
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        id: 'Fecha de creación',
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Fecha de Creación
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
