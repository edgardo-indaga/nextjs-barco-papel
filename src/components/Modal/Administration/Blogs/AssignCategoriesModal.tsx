'use client';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { getBlogCategories, updateBlogCategories } from '@/actions/Administration/BlogCategory';
import { getAllCategories } from '@/actions/Administration/Categories';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';

// Componente para el botón de envío con estado
function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || disabled}>
            {pending ? 'Actualizando...' : 'Actualizar'}
        </Button>
    );
}

export default function AssignCategoriesModal({
    id,
    open,
    onCloseAction,
    refreshAction,
}: EditModalPropsAlt) {
    const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Obtener todas las categorías disponibles
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setAllCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('No se pudieron cargar las categorías disponibles');
            }
        };
        fetchCategories();
    }, []);

    // Obtener las categorías asignadas al blog
    useEffect(() => {
        const fetchBlogCategories = async () => {
            if (id) {
                try {
                    const blogCategories = await getBlogCategories(id);
                    const assignedCategoryIds = blogCategories
                        .map((bc) => bc.categoryId)
                        .filter((catId): catId is string => catId !== null);
                    setSelectedCategories(assignedCategoryIds);
                } catch (err) {
                    console.error('Error fetching blog categories:', err);
                    setError('No se pudieron cargar las categorías del blog');
                }
            }
        };
        if (open) {
            fetchBlogCategories();
        }
    }, [open, id]);

    // Manejar cambio de selección de categorías
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    // Acción del formulario con Server Action
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id) {
            setError('El ID del blog no está definido');
            return;
        }

        try {
            const result = await updateBlogCategories(id, selectedCategories);
            if (result.success) {
                refreshAction?.();
                onCloseAction(false);
                toast.success('Categorías Actualizadas', {
                    description: 'Las categorías del blog se han actualizado correctamente.',
                });
            } else {
                throw new Error('Error al actualizar las categorías');
            }
        } catch (err) {
            console.error('Error updating blog categories:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al actualizar');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Asignar Categorías Secundarias</DialogTitle>
                    <DialogDescription>
                        Selecciona las categorías secundarias para este blog. La categoría principal
                        se gestiona desde la edición del blog.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-[15px] grid max-h-60 grid-cols-1 overflow-y-auto">
                        {allCategories.map((category) => (
                            <div key={category.id} className="flex items-center px-4 py-1">
                                <input
                                    type="checkbox"
                                    id={`category-${category.id}`}
                                    name="categories"
                                    value={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className="mr-2 h-4 w-4 accent-[#262626] focus:ring-offset-0"
                                />
                                <label
                                    htmlFor={`category-${category.id}`}
                                    className="text-gris text-[15px]"
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onCloseAction(false)}
                        >
                            Cancelar
                        </Button>
                        <SubmitButton disabled={allCategories.length === 0} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
