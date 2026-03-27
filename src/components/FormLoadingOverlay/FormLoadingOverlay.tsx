'use client';

import { Loader2 } from 'lucide-react';

interface FormLoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export default function FormLoadingOverlay({
    visible,
    message = 'Procesando...',
}: FormLoadingOverlayProps) {
    if (!visible) return null;

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg bg-white/75 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="mt-3 text-sm font-medium text-gray-600">{message}</p>
        </div>
    );
}
