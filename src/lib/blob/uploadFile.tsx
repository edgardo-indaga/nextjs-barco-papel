import { v2 as cloudinary } from 'cloudinary';
import { compressToWebp } from '@/lib/image/compressToWebp';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funci�n para generar una cadena aleatoria de 8 caracteres
function generateRandomString(length = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export interface UploadFileOptions {
    file: File;
    folder?: string;
    prefix?: string;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB en bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

/**
 * Sube un archivo a Cloudinary con compresi�n WebP.
 * Retorna la URL p�blica del archivo o null si falla.
 */
export async function uploadFile({
    file,
    folder = 'uploads',
    prefix = '',
}: UploadFileOptions): Promise<string | null> {
    // Validar tama�o del archivo (antes de comprimir)
    if (!file || file.size > MAX_FILE_SIZE) {
        throw new Error('El archivo excede el tama\u00F1o m\u00E1ximo permitido de 4MB');
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
            'Tipo de archivo no permitido. Solo se permiten im\u00E1genes JPG, PNG, WEBP y GIF',
        );
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error('Extensi\u00F3n de archivo no permitida');
    }

    // Comprimir imagen a WebP
    const webpBuffer = await compressToWebp(file);

    const randomId = generateRandomString();
    const publicId = `${folder}/${prefix}${randomId}-${Date.now()}`;

    try {
        const result = await new Promise<{ public_id: string; format: string }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        public_id: publicId,
                        resource_type: 'image',
                        format: 'webp',
                    },
                    (error, result) => {
                        if (error || !result) {
                            reject(error || new Error('No se recibi\u00F3 resultado de Cloudinary'));
                        } else {
                            resolve(result as { public_id: string; format: string });
                        }
                    },
                )
                .end(webpBuffer);
        });

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        return `https://res.cloudinary.com/${cloudName}/image/upload/${result.public_id}.${result.format}`;
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        throw new Error('Error al subir el archivo. Por favor, int\u00E9ntelo de nuevo.');
    }
}

/**
 * Sube un archivo raw (Buffer) a Cloudinary sin compresi�n adicional.
 * Usado por mutations que manejan sus propios archivos.
 */
export async function uploadRawFile(
    buffer: Buffer | File,
    fileName: string,
    contentType: string,
): Promise<string> {
    const uploadBuffer = buffer instanceof File ? Buffer.from(await buffer.arrayBuffer()) : buffer;

    const publicId = fileName.replace(/\.[^/.]+$/, '');

    const result = await new Promise<{ public_id: string; format: string }>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    public_id: publicId,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error || new Error('No se recibi\u00F3 resultado de Cloudinary'));
                    } else {
                        resolve(result as { public_id: string; format: string });
                    }
                },
            )
            .end(uploadBuffer);
    });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${result.public_id}.${result.format}`;
}

/**
 * Elimina un archivo de Cloudinary usando su URL o ruta relativa.
 */
export async function deleteFile(url: string): Promise<void> {
    try {
        if (!url) return;

        let publicId = '';

        if (url.startsWith('http')) {
            // Extraer el public_id de la URL de Cloudinary
            // URL formato: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const uploadIndex = pathParts.indexOf('upload');
            if (uploadIndex === -1) return;

            // El public_id es todo despu\u00E9s de "upload/v{version}/"
            const afterUpload = pathParts.slice(uploadIndex + 1);
            // Saltar el par\u00E1metro de versi\u00F3n (v1234567890)
            const startIndex =
                afterUpload[0]?.startsWith('v') && /^v\d+$/.test(afterUpload[0]) ? 1 : 0;
            const publicIdWithExt = afterUpload.slice(startIndex).join('/');
            // Quitar la extensi\u00F3n del archivo
            publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
        } else {
            // Es una ruta relativa: folder/filename.ext
            publicId = url.replace(/\.[^/.]+$/, '');
        }

        if (!publicId) return;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw new Error('Error al eliminar el archivo anterior.');
    }
}
