'use client';

import { cn } from '@/lib/utils';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

interface CategoryFilterProps {
    categories: CategoryInterface[];
    selectedCategoryId: string | null;
    onCategoryChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategoryId,
    onCategoryChange,
}: CategoryFilterProps) {
    return (
        <div className="mb-8 flex flex-wrap justify-center gap-3 md:mb-[100px] md:gap-4">
            {/* Botón "Todas" */}
            <button
                type="button"
                onClick={() => onCategoryChange(null)}
                className={cn(
                    'font-basic-sans rounded-[10px] px-4 py-2 text-[14px] font-semibold uppercase transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-[15px] md:px-6 md:py-3 md:text-[16px]',
                    selectedCategoryId === null
                        ? 'bg-negro text-fucsia shadow-lg'
                        : 'border-negro text-negro hover:bg-negro hover:text-fucsia cursor-pointer border-1 bg-transparent',
                )}
            >
                Todas
            </button>

            {/* Botones de categorías */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                        'font-basic-sans rounded-[10px] px-4 py-2 text-[14px] font-semibold uppercase transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-[15px] md:px-6 md:py-3 md:text-[16px]',
                        selectedCategoryId === category.id
                            ? 'bg-negro text-fucsia shadow-lg'
                            : 'border-negro text-negro hover:bg-negro hover:text-fucsia cursor-pointer border-1 bg-transparent',
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
