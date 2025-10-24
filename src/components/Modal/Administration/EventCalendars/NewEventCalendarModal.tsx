'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createEvent } from '@/actions/Administration/EventCalendars';
import { getEventCategoriesForSelect } from '@/actions/Administration/EventCategories';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

interface EventCategory {
    id: string;
    name: string;
}

export default function NewEventCalendarModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EventeCalendarInterface>({ mode: 'onChange' });

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/default.png');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedCategoryId = watch('eventCategoryId');

    // Cargar categorías cuando se abre el modal
    useEffect(() => {
        const loadCategories = async () => {
            if (isOpen) {
                try {
                    const data = await getEventCategoriesForSelect();
                    setCategories(data);
                } catch (error) {
                    console.error('Error loading categories:', error);
                    toast.error('Error', {
                        description: 'No se pudieron cargar las categorías',
                    });
                }
            }
        };
        loadCategories();
    }, [isOpen]);

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

    const onSubmit = async (data: EventeCalendarInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);

        // Fix timezone issue by creating date at noon local time
        const dateValue = new Date(`${data.date}T12:00:00`);
        formData.append('date', dateValue.toISOString());

        formData.append('eventCategoryId', data.eventCategoryId); // Nuevo campo requerido

        if (data.venue) {
            formData.append('venue', data.venue);
        }
        if (data.eventDays) {
            formData.append('eventDays', data.eventDays);
        }
        if (data.showTime) {
            formData.append('showTime', data.showTime);
        }
        if (data.audienceType) {
            formData.append('audienceType', data.audienceType);
        }
        if (data.price) {
            formData.append('price', data.price);
        }
        if (data.linkUrl) {
            formData.append('linkUrl', data.linkUrl); // Nuevo campo opcional
        }

        // Estado del evento (por defecto activo = 1)
        formData.append('state', String(data.state ?? 1));

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await createEvent(formData);

            if (!response) {
                setError('Problemas al crear el evento');
                return;
            }
            refreshAction();
            handleOpenChange(false);
            toast.success('Nuevo Evento Creado', {
                description: 'El evento se ha creado correctamente.',
            });
        } catch (error) {
            reset();
            toast.error('Error al Crear Evento', {
                description: 'Error al intentar crear el evento',
            });
            setImagePreview('/default.png');
            setError('Error al crear el evento. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo evento. Asegúrate de que toda la información
                        esté correcta antes de proceder.
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
                                    placeholder="Nombre del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                />
                                {errors.name && (
                                    <p className="custom-form-error">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Categoría</Label>
                                <Select
                                    value={selectedCategoryId}
                                    onValueChange={(value) => setValue('eventCategoryId', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.eventCategoryId && (
                                    <p className="custom-form-error">
                                        {errors.eventCategoryId.message}
                                    </p>
                                )}
                                <input
                                    type="hidden"
                                    {...register('eventCategoryId', {
                                        required: 'La categoría es obligatoria',
                                    })}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Fecha de Publicación</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('date', {
                                        required: 'La fecha es obligatoria',
                                    })}
                                />
                                {errors.date && (
                                    <p className="custom-form-error">{errors.date.message}</p>
                                )}
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Lugar</Label>
                                <Input
                                    id="venue"
                                    type="text"
                                    placeholder="Lugar del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('venue')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Día/s del Evento</Label>
                                <Input
                                    id="eventDays"
                                    type="text"
                                    placeholder="Lunes a Viernes, Fines de semana, etc."
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('eventDays')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Hora del Espectáculo</Label>
                                <Input
                                    id="showTime"
                                    type="text"
                                    placeholder="14:30, A las 8 PM, Horario a confirmar, etc."
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('showTime')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Tipo de Audiencia</Label>
                                <Input
                                    id="audienceType"
                                    type="text"
                                    placeholder="Tipo de audiencia"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('audienceType')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Precio</Label>
                                <Input
                                    id="price"
                                    type="text"
                                    placeholder="$10.000, Gratis, Precio a consultar, etc."
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('price')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Enlace (URL)</Label>
                                <Input
                                    id="linkUrl"
                                    type="url"
                                    placeholder="https://ejemplo.com"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('linkUrl')}
                                />
                            </div>

                            <div className="mb-[15px]">
                                <Label className="custom-label">Estado</Label>
                                <Select
                                    value={String(watch('state') ?? 1)}
                                    onValueChange={(value) =>
                                        setValue('state', Number.parseInt(value))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Activo (Visible al público)
                                        </SelectItem>
                                        <SelectItem value="0">Inactivo (Oculto)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    {...register('state', { valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <Image
                                src={imagePreview}
                                width={220}
                                height={220}
                                alt="Vista previa de la imagen"
                                className="h-[220px] w-[220px] rounded-[3%] object-cover"
                            />
                            <label
                                htmlFor="file-upload-event"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Imagen Evento
                            </label>
                            <Input
                                id="file-upload-event"
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
