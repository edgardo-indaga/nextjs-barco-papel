import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import BlogsTable from '@/components/Tables/Administration/Blogs/BlogsTable';
import CategoriesTable from '@/components/Tables/Administration/Categories/CategoriesTable';

export default function BlogPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-2">
                        <BlogsTable />
                    </div>
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-1">
                        <CategoriesTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
