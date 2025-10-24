'use client';

import { FilePenLine } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getPostById, updatePost } from '@/actions/Administration/Blogs';
import { getAllCategories } from '@/actions/Administration/Categories';
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
import type { EditModalPropsAlt } from '@/types/settings/Generic/InterfaceGeneric';

export default function EditBlogModal({
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

    const [serverError, setServerError] = useState('');
    const [originalImage, setOriginalImage] = useState<string>('/default.png');
    const [imagePreview, setImagePreview] = useState<string>('/default.png');
    const [blogData, setBlogData] = useState<BlogUniqueInterface | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [description, setDescription] = useState('');

    const selectedCategoryId = watch('primaryCategoryId');

    useEffect(() => {
        if (!open) {
            reset();
            setServerError('');
            setSelectedImage(null);
            setDescription('');
            // Restaurar imagen original en lugar de por defecto
            setImagePreview(originalImage);
            // NO resetear originalImage ni blogData para preservar datos
        }
    }, [open, reset, originalImage]);

    const handleCloseModal = () => {
        onCloseAction(false);
    };

    // Cargar categorías
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

    // Cargar datos del blog
    useEffect(() => {
        const loadBlogData = async () => {
            if (open && id) {
                try {
                    const blog = await getPostById(id);
                    if (blog) {
                        setBlogData(blog);
                        setValue('name', blog.name);
                        setValue('author', blog.author);
                        setDescription(blog.description);
                        setValue('primaryCategoryId', blog.primaryCategoryId);
                        setValue('description', blog.description);

                        // Trigger validación después de cargar los datos
                        setTimeout(() => {
                            trigger(['name', 'author', 'primaryCategoryId', 'description']);
                        }, 200);
                        if (blog.image) {
                            setOriginalImage(blog.image);
                            setImagePreview(blog.image);
                        } else {
                            setOriginalImage('/default.png');
                            setImagePreview('/default.png');
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del blog:', error);
                    toast.error('Error', {
                        description: 'No se pudieron cargar los datos del blog',
                    });
                }
            }
        };
        loadBlogData();
    }, [open, id, setValue]);

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
                setImagePreview(originalImage);
                setSelectedImage(null);
                return;
            }

            if (file.size > maxSizeInBytes) {
                setServerError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview(originalImage);
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

        // Agregar imagen actual como campo hidden para preservarla
        if (originalImage && originalImage !== '/default.png') {
            formData.append('currentImage', originalImage);
        }

        // SOLO enviar nueva imagen si el usuario seleccionó una
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await updatePost(id as string, formData);

            if ('error' in response) {
                setServerError(response.error);
                return;
            }

            toast.success('Blog Editado Correctamente', {
                description: 'El blog se ha editado correctamente.',
            });
            refreshAction?.();
            handleCloseModal();
        } catch (error) {
            toast.error('Error al Editar Blog', {
                description: 'Error al intentar editar el blog',
            });
            setServerError('Error al editar el blog. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Editar Blog</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del blog. Puedes cambiar el título, autor, categoría,
                        descripción e imagen. Asegúrate de que toda la información esté correcta
                        antes de guardar los cambios.
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
                                    {...register('name', {
                                        required: 'El título es obligatorio',
                                    })}
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
                                    {...register('author', {
                                        required: 'El autor es obligatorio',
                                    })}
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
                                className="h-[200px] w-[200px] rounded-[3%] object-cover"
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
                    {serverError && <p className="text-sm text-red-500">{serverError}</p>}
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
