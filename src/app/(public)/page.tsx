// Next.js imports
import Image from 'next/image';
import Link from 'next/link';
import CarouselSponsors from '@/components/Home/Carousel/Carousel';
// Internal components
import Cartelera from '@/components/Home/Cartelera/Cartelera';
import NewsHome from '@/components/Home/NewsHome/NewsHome';
import Suscribite from '@/components/Home/Suscribite/Suscribite';

// Forzar generación dinámica para resolver problemas de noticias en producción
export const dynamic = 'force-dynamic';

export default async function Home() {
    const imageSlider = '/image-home-01.png';
    const azulMedio = '/azul-medio-alt.png';
    const footerBarc = '/footer-barco.png';

    return (
        <main className="bg-web">
            <section className="mt-[-120px] h-screen sm:mt-[-60px] sm:h-[60vh] md:mt-[-120px] md:h-screen">
                <Image
                    src={imageSlider}
                    alt="Imagen Slider"
                    width={2200}
                    height={1315}
                    className="h-full w-full object-cover object-bottom"
                    priority
                />
            </section>

            <section className="container mx-auto max-w-[1100px] px-4 py-[40px] sm:px-6 md:py-[100px]">
                <NewsHome />
                <div className="mt-[40px] flex items-center justify-center md:mt-[100px]">
                    <Link
                        href="/blogs"
                        className="bg-fucsia text-negro hover:bg-negro hover:text-fucsia font-basic-sans rounded-[10px] px-[24px] py-[10px] text-[16px] leading-[16px] font-normal transition-colors sm:px-[30px] sm:py-[12px] sm:text-[18px] sm:leading-[18px]"
                    >
                        Cargar más
                    </Link>
                </div>
                <div className="mt-[40px] md:mt-[70px]">
                    <h1 className="text-azul font-basic-sans text-center text-[24px] leading-[28px] font-bold tracking-[2px] sm:text-[32px] sm:leading-[36px] sm:tracking-[3px] md:text-[40px] md:leading-[44px] md:tracking-[4px]">
                        LO QUE SE HEREDA, SE TRANSFORMA Y SE CREA EN ESTE TERRITORIO.
                    </h1>
                </div>
            </section>

            <section className="flex items-center justify-center">
                <Image
                    src={azulMedio}
                    alt="Línea separadora"
                    width={8005}
                    height={1120}
                    className="h-auto w-[100vw]"
                />
            </section>

            <section
                className="container mx-auto max-w-[1100px] px-4 pt-[50px] sm:px-6 md:pt-[100px]"
                id="cartelera"
            >
                <div className="mb-[40px] md:mb-[70px]">
                    <h2 className="font-basic-sans mb-4 text-center text-[24px] leading-[28px] font-bold sm:text-[28px] sm:leading-[32px] md:text-[30px] md:leading-[34px]">
                        CARTELERA
                    </h2>
                    <p className="text-fucsia font-basic-sans text-center text-[18px] font-light sm:text-[20px] md:text-[24px]">
                        Descubre los eventos programados para los próximos 30 días
                    </p>
                </div>
                <Cartelera />
            </section>

            <section className="container mx-auto max-w-[1100px] px-4 pt-[50px] sm:px-6 md:pt-[100px]">
                <div>
                    <h2 className="font-basic-sans mb-4 text-center text-[24px] leading-[28px] font-bold sm:text-[28px] sm:leading-[32px] md:text-[30px] md:leading-[34px]">
                        ALIANZAS
                    </h2>
                    <CarouselSponsors />
                </div>
            </section>

            <section className="container mx-auto max-w-[1100px] px-4 pt-[50px] sm:px-6 md:pt-[100px]">
                <div>
                    <h1 className="text-azul font-basic-sans text-[20px] leading-[24px] font-bold tracking-[2px] sm:text-[28px] sm:leading-[32px] sm:tracking-[3px] md:text-[40px] md:leading-[44px] md:tracking-[4px]">
                        ACOMPAÑAMOS LAS PREGUNTAS QUE NOS HACEMOS SOBRE EL LUGAR QUE HABITAMOS.
                    </h1>
                </div>
                <div className="mt-[20px] md:mt-[40px]">
                    <Suscribite />
                </div>
            </section>
            <div className="md:mt-[-260px]">
                <Image
                    src={footerBarc}
                    alt="Footer Barco"
                    width={8000}
                    height={2866}
                    className="h-auto w-[100vw]"
                />
            </div>
        </main>
    );
}
