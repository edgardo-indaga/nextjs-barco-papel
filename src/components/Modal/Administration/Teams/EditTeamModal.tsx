'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getTeamById, updateTeam } from '@/actions/Administration/Teams';

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
import { Textarea } from '@/components/ui/textarea';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';

export default function EditTeamModal({
    id,
    refreshAction,
    open,
    onCloseAction,
}: EditModalPropsAlt) {
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<TeamsInterface>({ mode: 'onChange' });

    const [error, setError] = useState('');
    const [originalImage, setOriginalImage] = useState<string>('/team.jpg');
    const [imagePreview, setImagePreview] = useState<string>('/team.jpg');
    const [teamData, setTeamData] = useState<TeamsInterface | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (!open) {
            reset();
            setError('');
            setSelectedImage(null);
            // Restaurar imagen original en lugar de por defecto
            setImagePreview(originalImage);
            // NO resetear originalImage ni teamData para preservar datos
        }
    }, [open, reset, originalImage]);

    const handleCloseModal = () => {
        onCloseAction(false);
    };

    useEffect(() => {
        const loadTeamData = async () => {
            if (open && id) {
                try {
                    const team = await getTeamById(id);
                    if (team) {
                        setTeamData(team);
                        setValue('name', team.name);
                        setValue('description', team.description);
                        // Si el equipo tiene imagen, mostrarla
                        if (team.image) {
                            setOriginalImage(team.image);
                            setImagePreview(team.image);
                        } else {
                            setOriginalImage('/team.jpg');
                            setImagePreview('/team.jpg');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del equipo:', error);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos del equipo',
                    });
                }
            }
        };
        loadTeamData();
    }, [open, id, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 4194304; // 4MB

        if (file) {
            // Validación para archivos SVG
            if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
                setError(
                    'No se permiten archivos SVG. Por favor, carga una imagen en formato JPG, PNG o similar.',
                );
                e.target.value = '';
                setImagePreview(originalImage);
                setSelectedImage(null);
                return;
            }

            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview(originalImage);
                setSelectedImage(null);
                return;
            }
            setError('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setSelectedImage(file);
        }
    };

    const onSubmit = async (data: TeamsInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);

        // Agregar imagen actual como campo hidden para preservarla
        if (originalImage && originalImage !== '/team.jpg') {
            formData.append('currentImage', originalImage);
        }

        // SOLO enviar nueva imagen si el usuario seleccionó una
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const response = await updateTeam(id as string, formData);
        if ('error' in response) {
            setError(response.error);
        } else {
            refreshAction?.();
            handleCloseModal();
            toast.success('Editado Correctamente', {
                description: 'El miembro se ha editado correctamente.',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="overflow-hidden sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Editar Miembro del Equipo</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del miembro del equipo. Puedes cambiar el nombre,
                        descripción e imagen. Asegúrate de que toda la información esté correcta
                        antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2 mr-[15px]">
                            <div className="mb-[15px]">
                                <Label className="custom-label">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nombre Completo"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('name', {
                                        required: 'El nombre es obligatorio',
                                    })}
                                />
                                {errors.name && (
                                    <p className="custom-form-error">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Escribe la descripción de este miembro"
                                    {...register('description', {
                                        required: 'La descripción es requerida',
                                    })}
                                />
                                {errors.description && (
                                    <p className="custom-form-error">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center">
                            <Image
                                src={imagePreview}
                                width={220}
                                height={220}
                                alt="Vista previa de la imagen"
                                className="h-[200px] w-[200px] rounded-[50%] object-cover"
                            />
                            <label
                                htmlFor="file-upload"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Cambiar foto
                            </label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <DialogFooter className="items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <BtnSubmit label="Actualizar" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
