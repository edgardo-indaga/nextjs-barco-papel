'use client';

import { cn } from '@/lib/utils';

interface PaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
    // No mostrar paginador si solo hay una página o menos
    if (totalPages <= 1) return null;

    // Generar array de números de página
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-8 flex justify-center md:mt-12">
            <div className="flex gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={cn(
                            'font-basic-sans flex h-10 w-10 items-center justify-center text-[16px] font-semibold transition-all duration-200 md:h-12 md:w-12 md:text-[18px]',
                            currentPage === page
                                ? 'bg-negro text-fucsia' // Activo: fondo negro, texto fucsia
                                : 'border-negro text-fucsia hover:bg-negro hover:text-fucsia border-2 bg-transparent', // Inactivo: borde negro, texto fucsia, fondo transparente
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
