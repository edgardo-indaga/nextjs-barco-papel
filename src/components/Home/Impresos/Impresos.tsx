import Image from 'next/image';
import { getAllMaterialHome } from '@/actions/Administration/PrintedMaterials/queries';

export default async function Impresos() {
    const materials = await getAllMaterialHome();

    return (
        <div className="mb-8 flex flex-col gap-6 md:mb-12 md:gap-8">
            {materials.map((material) => (
                <article key={material.id} className="flex flex-col overflow-hidden">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 md:p-6">
                        {/* Imagen */}
                        <div className="flex-shrink-0">
                            {material.image ? (
                                <div className="relative h-[200px] w-full overflow-hidden rounded-lg sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px]">
                                    <Image
                                        src={material.image}
                                        alt={material.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100 sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px]">
                                    <div className="text-[48px] text-gray-400 sm:text-[56px] md:text-[64px]">
                                        =?
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contenido */}
                        <div className="flex flex-1 flex-col justify-between">
                            {/* Número de versión */}
                            <div className="mb-4">
                                <div className="mb-2">
                                    <span className="font-basic-sans text-fucsia text-[18px] font-semibold uppercase sm:text-[20px] md:text-[24px]">
                                        Nº{material.numberVersion}
                                    </span>
                                </div>

                                {/* Nombre */}
                                <h2 className="font-basic-sans text-negro text-[20px] leading-[24px] font-semibold sm:text-[24px] sm:leading-[28px] md:text-[28px] md:leading-[32px]">
                                    {material.name}
                                </h2>
                            </div>

                            <div className="mb-4 md:mb-6">
                                {material.description && (
                                    <p className="font-basic-sans text-negro text-[14px] leading-[18px] sm:text-[15px] sm:leading-[20px] md:text-[16px] md:leading-[22px]">
                                        {material.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                {material.link && (
                                    <a
                                        href={material.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-negro text-fucsia hover:bg-fucsia hover:text-negro inline-block rounded-lg px-[16px] py-[8px] text-[14px] font-medium transition-colors sm:px-[20px] sm:py-[10px] sm:text-[16px] md:px-[24px] md:py-[12px] md:text-[18px]"
                                    >
                                        CARTA DE NAVEGACIÓN
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
