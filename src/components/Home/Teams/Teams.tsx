import Image from 'next/image';
import { getAllTeamsHome } from '@/actions/Administration/Teams/queries';

export default async function Teams() {
    const teams = await getAllTeamsHome();

    // Logging temporal para debug en producción
    console.log('🔍 Teams component - Data loaded:', {
        count: teams?.length || 0,
        teams: teams?.map((t) => ({ id: t.id, name: t.name, hasImage: !!t.image })) || [],
    });

    // Manejo de caso cuando no hay datos
    if (!teams || teams.length === 0) {
        console.log('⚠️ No teams data found');
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-center text-gray-500">
                    No hay miembros del equipo disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-12 md:gap-8 lg:grid-cols-3">
            {teams.map((team) => (
                <article key={team.id} className="text-center">
                    {/* Imagen con placeholder */}
                    <div className="relative mb-4 h-[200px] w-full overflow-hidden rounded-[10px] border-2 border-gray-300 sm:h-[240px] md:h-[280px]">
                        {team.image ? (
                            <Image src={team.image} alt={team.name} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <div className="text-[48px] text-gray-400 sm:text-[56px] md:text-[64px]">
                                    =d
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nombre */}
                    <h2 className="font-basic-sans text-negro mb-2 text-[16px] leading-[20px] font-semibold uppercase sm:mb-3 sm:text-[18px] sm:leading-[22px] md:mb-4 md:text-[20px] md:leading-[24px]">
                        {team.name}
                    </h2>

                    {/* Descripción */}
                    <p className="font-basic-sans text-negro text-[13px] leading-[16px] sm:text-[14px] sm:leading-[17px] md:text-[15px] md:leading-[18px]">
                        {team.description}
                    </p>
                </article>
            ))}
        </div>
    );
}
