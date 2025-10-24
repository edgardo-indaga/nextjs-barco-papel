import type {
    BlogCategoryInterface,
    CategoryInterface,
} from '@/types/Administration/Blogs/CategoryInterface';

export interface BlogInterface {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    author: string;
    primaryCategoryId: string;
    primaryCategory: CategoryInterface;
    BlogCategory: BlogCategoryInterface[];
    createdAt: string;
}

export interface BlogUniqueInterface {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    primaryCategoryId: string;
    primaryCategory: CategoryInterface;
    author: string;
    description: string;
    createdAt: string;
}
