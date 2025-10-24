'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    getEventCategoryById,
    updateEventCategory,
} from '@/actions/Administration/EventCategories';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EditModalProps } from '@/types/settings/Generic/InterfaceGeneric';

interface EventCategoryFormData {
    name: string;
}

export default function EditEventCategoryModal({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalProps) {
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<EventCategoryFormData>({ mode: 'onChange' });

    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            reset();
            setError('');
        }
    }, [open, reset]);

    useEffect(() => {
        async function loadEventCategory() {
            if (id && open) {
                try {
                    const eventCategory = await getEventCategoryById(id);
                    if (eventCategory) {
                        setValue('name', eventCategory.name || '');
                    }
                } catch (e) {
                    console.error('Error loading event category:', e);
                    setError('Error al cargar la categoría de evento');
                }
            }
        }

        loadEventCategory();
    }, [id, open, setValue]);

    const onSubmit = async (data: EventCategoryFormData) => {
        if (!data.name || data.name.trim() === '') {
            setError('El nombre es requerido');
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);

        try {
            const response = await updateEventCategory(id, formData);
            if ('error' in response) {
                setError(response.error);
                return;
            }
            refreshAction();
            onCloseAction(false);
            toast.success('Categoría de Evento Actualizada', {
                description: 'La categoría de evento se ha actualizado correctamente.',
            });
        } catch (error) {
            setError('Error al actualizar la categoría de evento. Inténtalo de nuevo.');
            console.error(error);
            toast.error('Actualización Fallida', {
                description: 'Error al intentar actualizar la categoría de evento',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Categoría de Evento</DialogTitle>
                    <DialogDescription>
                        Modifica el nombre de la categoría de evento existente.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Label className="custom-label">Nombre de la Categoría</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nombre de la categoría de evento"
                            className="w-full"
                            autoComplete="off"
                            {...register('name', { required: 'El nombre es requerido' })}
                        />
                        {errors.name && <p className="custom-form-error">{errors.name.message}</p>}
                    </div>
                    {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                    <DialogFooter className="mt-6 items-end">
                        <Button type="submit" className="custom-button">
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
