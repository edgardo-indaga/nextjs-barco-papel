import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import SponsorsTable from '@/components/Tables/Administration/Sponsors/SponsorsTable';

export default function SponsorsPafe() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="bg-muted/50 col-span-1 rounded-xl p-6 md:col-span-2">
                        <SponsorsTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
