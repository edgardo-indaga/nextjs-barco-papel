'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getMaterialById, updateMaterial } from '@/actions/Administration/PrintedMaterials';

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
import type { PrintedMaterialInterface } from '@/types/Administration/PrintedMaterials/PrintedMaterialInterface';
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';

export default function EditPrintedMaterialModal({
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
    } = useForm<PrintedMaterialInterface>({ mode: 'onChange' });

    const [error, setError] = useState('');
    const [originalImage, setOriginalImage] = useState<string>('/default.png');
    const [imagePreview, setImagePreview] = useState<string>('/default.png');
    const [materialData, setMaterialData] = useState<PrintedMaterialInterface | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (!open) {
            reset();
            setError('');
            setSelectedImage(null);
            // Restaurar imagen original en lugar de por defecto
            setImagePreview(originalImage);
            // NO resetear originalImage ni materialData para preservar datos
        }
    }, [open, reset, originalImage]);

    const handleCloseModal = () => {
        onCloseAction(false);
    };

    useEffect(() => {
        const loadMaterialData = async () => {
            if (open && id) {
                try {
                    const material = await getMaterialById(id);
                    if (material) {
                        setMaterialData(material);
                        setValue('name', material.name);
                        setValue('numberVersion', material.numberVersion);
                        setValue('description', material.description || '');
                        setValue('link', material.link || '');
                        if (material.image) {
                            setOriginalImage(material.image);
                            setImagePreview(material.image);
                        } else {
                            setOriginalImage('/default.png');
                            setImagePreview('/default.png');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del material:', error);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos del material',
                    });
                }
            }
        };
        loadMaterialData();
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

    const onSubmit = async (data: PrintedMaterialInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('numberVersion', data.numberVersion.toString());

        if (data.description) {
            formData.append('description', data.description);
        }
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

        const response = await updateMaterial(id as string, formData);

        if ('error' in response) {
            setError(response.error);
        } else {
            toast.success('Material Editado Correctamente', {
                description: 'El material se ha editado correctamente.',
            });
            refreshAction?.();
            handleCloseModal();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="overflow-hidden sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Editar Material Impreso</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del material. Puedes cambiar el nombre, versión,
                        descripción, link e imagen. Asegúrate de que toda la información esté
                        correcta antes de guardar los cambios.
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
                                    placeholder="Nombre del material"
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
                                <Label className="custom-label">Versión</Label>
                                <Input
                                    id="numberVersion"
                                    type="number"
                                    placeholder="Número de Versión"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('numberVersion', {
                                        required: 'El número de versión es obligatorio',
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.numberVersion && (
                                    <p className="custom-form-error">
                                        {errors.numberVersion.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descripción del material"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('description')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Link</Label>
                                <Input
                                    id="link"
                                    type="link"
                                    placeholder="Link del material"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('link')}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center">
                            <Image
                                src={imagePreview}
                                width={220}
                                height={220}
                                alt="Vista previa de la imagen"
                                className="h-[200px] w-[200px] rounded-[3%] object-cover"
                            />
                            <label
                                htmlFor="file-upload-material-edit"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Cambiar foto
                            </label>
                            <Input
                                id="file-upload-material-edit"
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
