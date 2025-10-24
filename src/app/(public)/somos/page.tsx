import Image from 'next/image';
import CarouselSponsors from '@/components/Home/Carousel/Carousel';
import Teams from '@/components/Home/Teams/Teams';

// Forzar renderizado dinámico para evitar cache en producción
export const dynamic = 'force-dynamic';

export default function SomosPage() {
    const imageHeader = '/image-header-page.png';

    return (
        <main className="bg-web">
            <section className="h-[200px] sm:h-[240px] md:h-[299px]">
                <Image
                    src={imageHeader}
                    alt="Imagen Header Page"
                    width={2200}
                    height={299}
                    className="h-full w-full object-cover object-top"
                    priority
                />
            </section>
            <section className="container mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 md:pb-[50px]">
                <h1 className="font-basic-sans text-negro mb-4 text-[32px] font-bold sm:text-[40px] md:text-[48px]">
                    EQUIPO
                </h1>
                <div className="mt-8 sm:mt-10 md:mt-[60px]">
                    <p className="font-basic-sans py-[15px] text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-[18px] md:leading-[26px]">
                        Somos Catalina Billeke Brancoli, María José (Joja) Hess Paz, periodistas y
                        editoras, y Julieta Torres Etcheberry, publicista y directora creativa,
                        creadoras de este barco de papel, una plataforma para potenciar las
                        prácticas y expresiones culturales, patrimoniales y artísticas de la región
                        de Los Lagos, a través de una mirada profunda, reflexiva y con cobertura
                        amplia que pueda ampliar los márgenes del pluralismo de voces y miradas y
                        aporten al fortalecimiento de la identidad territorial y sentido de
                        colectividad.
                    </p>
                </div>
                <div className="mt-8 sm:mt-10 md:mt-[60px]">
                    <Teams />
                </div>
            </section>
            <section className="container mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 md:pb-[100px]">
                <h1 className="font-basic-sans text-negro mb-4 text-[32px] font-bold sm:text-[40px] md:text-[48px]">
                    COLABORAN
                </h1>
                <div className="mt-8 sm:mt-10 md:mt-[60px]">
                    <CarouselSponsors />
                </div>
            </section>
        </main>
    );
}
