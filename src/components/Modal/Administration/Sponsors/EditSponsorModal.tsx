'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getSponsorById, updateSponsor } from '@/actions/Administration/Sponsors';

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
import type { SponsorsInterface } from '@/types/Administration/Sponsors/SponsorsInterface';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';

export default function EditSponsorModal({
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
    } = useForm<SponsorsInterface>({ mode: 'onChange' });

    const [error, setError] = useState('');
    const [originalImage, setOriginalImage] = useState<string>('/default.png');
    const [imagePreview, setImagePreview] = useState<string>('/default.png');
    const [sponsorData, setSponsorData] = useState<SponsorsInterface | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (!open) {
            reset();
            setError('');
            setSelectedImage(null);
            // Restaurar imagen original en lugar de por defecto
            setImagePreview(originalImage);
            // NO resetear originalImage ni sponsorData para preservar datos
        }
    }, [open, reset, originalImage]);

    const handleCloseModal = () => {
        onCloseAction(false);
    };

    useEffect(() => {
        const loadSponsorData = async () => {
            if (open && id) {
                try {
                    const sponsor = await getSponsorById(id);
                    if (sponsor) {
                        setSponsorData(sponsor);
                        setValue('name', sponsor.name);
                        setValue('link', sponsor.link || '');
                        if (sponsor.image) {
                            setOriginalImage(sponsor.image);
                            setImagePreview(sponsor.image);
                        } else {
                            setOriginalImage('/default.png');
                            setImagePreview('/default.png');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del sponsor:', error);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos del sponsor',
                    });
                }
            }
        };
        loadSponsorData();
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

    const onSubmit = async (data: SponsorsInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.link) {
            formData.append('link', data.link);
        }

        // Agregar imagen actual como campo hidden para preservarla
        if (originalImage && originalImage !== '/default.png') {
            formData.append('currentImage', originalImage);
        }

        // SOLO enviar nueva imagen si el usuario seleccionó una
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const response = await updateSponsor(id as string, formData);

        if ('error' in response) {
            setError(response.error);
        } else {
            toast.success('Sponsor Editado Correctamente', {
                description: 'El sponsor se ha editado correctamente.',
            });
            refreshAction?.();
            handleCloseModal();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="overflow-hidden sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Editar Sponsor</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del sponsor. Puedes cambiar el nombre, link e imagen.
                        Asegúrate de que toda la información esté correcta antes de guardar los
                        cambios.
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
                                <Label className="custom-label">Link del Sponsor</Label>
                                <Input
                                    id="link"
                                    type="text"
                                    placeholder="https://ejemplo.com"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('link')}
                                />
                                {errors.link && (
                                    <p className="custom-form-error">{errors.link.message}</p>
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
                                htmlFor="file-upload-sponsor-edit"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Cambiar foto
                            </label>
                            <Input
                                id="file-upload-sponsor-edit"
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
