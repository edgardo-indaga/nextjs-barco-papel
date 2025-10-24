import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import PrintedMaterialsTable from '@/components/Tables/Administration/PrintedMaterials/PrintedMaterialsTable';

export default function PrintedMaterialsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="bg-muted/50 col-span-1 rounded-xl p-6 md:col-span-2">
                        <PrintedMaterialsTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
