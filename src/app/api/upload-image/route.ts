import { v2 as cloudinary } from 'cloudinary';
import { type NextRequest, NextResponse } from 'next/server';
import { compressToWebp } from '@/lib/image/compressToWebp';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;
        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json(
                { error: 'No se proporcion\u00F3 ninguna imagen.' },
                { status: 400 },
            );
        }

        // Validar tama\u00F1o de archivo (4MB m\u00E1ximo)
        const maxSizeInBytes = 4194304; // 4MB
        if (imageFile.size > maxSizeInBytes) {
            return NextResponse.json({ error: 'La imagen no puede superar 4MB.' }, { status: 400 });
        }
        // Permitir solo ciertos tipos de im\u00E1genes
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/bmp',
            'image/tiff',
            'image/x-icon',
        ];
        if (!allowedTypes.includes(imageFile.type)) {
            return NextResponse.json({ error: 'Tipo de imagen no permitido.' }, { status: 400 });
        }

        // Comprimir imagen a WebP (SVG se mantiene sin comprimir)
        const isSvg = imageFile.type === 'image/svg+xml';
        let uploadBuffer: Buffer;
        let format = 'webp';

        if (!isSvg) {
            uploadBuffer = await compressToWebp(imageFile);
        } else {
            uploadBuffer = Buffer.from(await imageFile.arrayBuffer());
            format = 'svg';
        }

        // Permitir carpeta personalizada para la organizaci\u00F3n
        const folder = formData.get('folder') as string | null;
        const safeFolder =
            folder && /^[a-zA-Z0-9-_/]+$/.test(folder) ? folder.replace(/\/+$/, '') : 'uploads';
        const publicId = `${safeFolder}/${Date.now()}`;

        const result = await new Promise<{ public_id: string; format: string }>((resolve, reject) => {
            const uploadOptions: Record<string, unknown> = {
                public_id: publicId,
                resource_type: isSvg ? 'raw' : 'image',
            };
            if (!isSvg) {
                uploadOptions.format = format;
            }

            cloudinary.uploader
                .upload_stream(uploadOptions, (error, result) => {
                    if (error || !result) {
                        reject(error || new Error('No se recibi\u00F3 resultado de Cloudinary'));
                    } else {
                        resolve(result as { public_id: string; format: string });
                    }
                })
                .end(uploadBuffer);
        });

        return NextResponse.json({ url: `${result.public_id}.${result.format}` });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        return NextResponse.json({ error: 'Error al subir la imagen.' }, { status: 500 });
    }
}
