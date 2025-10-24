export interface CategoryInterface {
    id: string;
    name: string;
}

export interface BlogCategoryInterface {
    id: string;
    blogId: string | null;
    categoryId: string | null;
    category?: CategoryInterface | null;
}
