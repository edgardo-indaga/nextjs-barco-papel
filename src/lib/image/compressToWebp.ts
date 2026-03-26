import sharp from 'sharp';

/**
 * Comprime una imagen a formato WebP usando sharp.
 * Acepta un File o Buffer y retorna un Buffer WebP comprimido.
 */
export async function compressToWebp(
    input: File | Buffer,
    options: { quality?: number } = {},
): Promise<Buffer> {
    const { quality = 80 } = options;

    const buffer =
        input instanceof File ? Buffer.from(await input.arrayBuffer()) : input;

    return sharp(buffer).webp({ quality }).toBuffer();
}
