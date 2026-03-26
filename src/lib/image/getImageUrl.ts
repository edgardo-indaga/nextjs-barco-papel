/**
 * Utility function to resolve an image path to a full URL.
 * Handles both absolute URLs (legacy) and relative paths (new strategy).
 *
 * @param path - The image path or absolute URL.
 * @returns The full URL to the image.
 */
export function getImageUrl(path: string | null | undefined): string {
    if (!path) return '';

    // If it is already an absolute URL, a local preview URL, or a local public path, return it as is.
    if (
        path.startsWith('http') ||
        path.startsWith('blob:') ||
        path.startsWith('data:') ||
        path.startsWith('/')
    ) {
        return path;
    }

    // Otherwise, assume it is a relative path stored in Cloudinary.
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined in environment variables.');
        return path; // Fallback to path if cloudName is missing
    }

    // Cloudinary base URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{path}
    return `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
}
