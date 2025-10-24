'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createCategory } from '@/actions/Administration/Categories';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import BtnSubmit from '@/components/BtnSubmit/BtnSubmit';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

interface CategoryFormData {
    name: string;
}

export default function NewCategoryModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>({ mode: 'onChange' });

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setError('');
        }
    };

    const onSubmit = async (data: CategoryFormData) => {
        setError('');

        if (!data.name || data.name.trim() === '') {
            setError('El nombre es requerido');
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);

        try {
            const response = await createCategory(formData);

            if ('error' in response) {
                setError(response.error);
                return;
            }

            toast.success('Nueva Categoría Creada', {
                description: 'La categoría se ha creado correctamente.',
            });
            refreshAction();
            reset();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(`Error al crear la categoría. Inténtalo de nuevo. (${errorMessage})`);
            toast.error('Crear Categoría Fallido', {
                description: 'Error al intentar crear la categoría',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nueva" permission={['Crear']} />
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Categoría</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre de la nueva categoría que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Label className="custom-label">Nombre de la Categoría</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nombre de la categoría"
                            className="w-full"
                            autoComplete="off"
                            {...register('name', { required: 'El nombre es requerido' })}
                        />
                        {errors.name && <p className="custom-form-error">{errors.name.message}</p>}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter className="mt-6 items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <BtnSubmit />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
