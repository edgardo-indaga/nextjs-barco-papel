'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createTeam } from '@/actions/Administration/Teams';
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
import { Textarea } from '@/components/ui/textarea';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

export default function NewTeamModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TeamsInterface>({ mode: 'onChange' });

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/default.png');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setImagePreview('/default.png');
            setSelectedImage(null);
            setError('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 4194304; // 4MB

        if (file) {
            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview('/default.png');
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
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        try {
            const response = await createTeam(formData);

            if (!response) {
                setError('Problemas al crear el Team');
                return;
            }
            refreshAction();
            handleOpenChange(false);
            toast.success('Nuevo Miembro del Equipo Creado', {
                description: 'El miembro se ha creado correctamente.',
            });
        } catch (error) {
            reset();
            toast.error('Nuevo Miembro Failed', {
                description: 'Error al intentar crear el miembro',
            });
            setImagePreview('/team.jpg');
            setError('Error al crear el miembro. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="overflow-hidden sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Miembro del Equipo</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo miembro del equipo, como el nombre y la
                        imagen. Asegúrate de que toda la información esté correcta antes de proceder
                        a crear la cuenta.
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
                                    {...register('name', { required: 'El nombre es obligatorio' })}
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
                                className="h-[220px] w-[220px] rounded-[3%] object-cover"
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
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <DialogFooter className="items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <BtnSubmit label="Crear" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
