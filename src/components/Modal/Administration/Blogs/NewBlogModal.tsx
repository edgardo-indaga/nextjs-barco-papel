'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createPost } from '@/actions/Administration/Blogs';
import { getAllCategories } from '@/actions/Administration/Categories';
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
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BlogUniqueInterface } from '@/types/Administration/Blogs/BlogInterface';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

export default function NewBlogModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<BlogUniqueInterface>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            primaryCategoryId: '',
            description: '',
        },
    });

    const [isOpen, setIsOpen] = useState(false);
    const [serverError, setServerError] = useState('');
    const [imagePreview, setImagePreview] = useState('/default.png');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [description, setDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedCategoryId = watch('primaryCategoryId');

    // Cargar categorías al montar el componente
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getAllCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error loading categories:', error);
                toast.error('Error', {
                    description: 'No se pudieron cargar las categorías',
                });
            } finally {
                setIsLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setImagePreview('/default.png');
            setSelectedImage(null);
            setServerError('');
            setDescription('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 4194304; // 4MB

        if (file) {
            // Validación para archivos SVG
            if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
                setServerError(
                    'No se permiten archivos SVG. Por favor, carga una imagen en formato JPG, PNG o similar.',
                );
                e.target.value = '';
                setImagePreview('/default.png');
                setSelectedImage(null);
                return;
            }

            if (file.size > maxSizeInBytes) {
                setServerError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview('/default.png');
                setSelectedImage(null);
                return;
            }
            setServerError('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setSelectedImage(file);
        }
    };

    const handleCategoryChange = (value: string) => {
        setValue('primaryCategoryId', value, {
            shouldValidate: true,
        });
        // Trigger validación manual para asegurar que se ejecute
        setTimeout(() => {
            trigger('primaryCategoryId');
        }, 100);
    };

    // Registrar campos que no tienen register para validaciones
    useEffect(() => {
        register('primaryCategoryId', {
            required: 'La categoría principal es obligatoria',
        });
        register('description', {
            required: 'La descripción es obligatoria',
            validate: (value) => {
                // Validar que el contenido no esté vacío (solo HTML sin texto)
                const textContent = value.replace(/<[^>]*>/g, '').trim();
                return textContent.length > 0 || 'La descripción no puede estar vacía';
            },
        });
    }, [register]);

    const onSubmit = async (data: BlogUniqueInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('author', data.author);
        formData.append('description', description);
        formData.append('primaryCategoryId', data.primaryCategoryId);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await createPost(formData);

            if ('error' in response) {
                setServerError(response.error);
                return;
            }

            refreshAction();
            handleOpenChange(false);
            toast.success('Nuevo Blog Creado', {
                description: 'El blog se ha creado correctamente.',
            });
        } catch (error) {
            reset();
            toast.error('Error al Crear Blog', {
                description: 'Error al intentar crear el blog',
            });
            setImagePreview('/default.png');
            setDescription('');
            setServerError('Error al crear el blog. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Blog</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo blog. Asegúrate de que toda la información
                        esté correcta antes de proceder.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-h-[calc(90vh-120px)] overflow-y-auto"
                >
                    <div className="grid grid-cols-3">
                        <div className="col-span-2 mr-[15px]">
                            <div className="mb-[15px]">
                                <Label className="custom-label">Título del Blog</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Título del blog"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('name', { required: 'El título es obligatorio' })}
                                />
                                {errors.name && (
                                    <p className="custom-form-error">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Autor</Label>
                                <Input
                                    id="author"
                                    type="text"
                                    placeholder="Nombre del autor"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('author', { required: 'El autor es obligatorio' })}
                                />
                                {errors.author && (
                                    <p className="custom-form-error">{errors.author.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Categoría Principal</Label>
                                <Select
                                    value={selectedCategoryId || ''}
                                    onValueChange={handleCategoryChange}
                                    disabled={isLoadingCategories}
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
                                {errors.primaryCategoryId && (
                                    <p className="custom-form-error">
                                        {errors.primaryCategoryId.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Descripción</Label>
                                <RichTextEditor
                                    content={description}
                                    onChangeAction={(content) => {
                                        setDescription(content);
                                        setValue('description', content, {
                                            shouldValidate: true,
                                        });
                                        // Trigger validación manual para asegurar que se ejecute
                                        setTimeout(() => {
                                            trigger('description');
                                        }, 100);
                                    }}
                                    imageFolder="blog-images"
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
                                htmlFor="file-upload-blog"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Imagen Blog
                            </label>
                            <Input
                                id="file-upload-blog"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                    {serverError && <p className="text-sm text-red-500">{serverError}</p>}
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
