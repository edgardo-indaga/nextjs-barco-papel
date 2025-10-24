import Image from 'next/image';
import Impresos from '@/components/Home/Impresos/Impresos';

export default function RevistaImpresos() {
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
            <section className="container mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 md:pb-[100px]">
                <h1 className="font-basic-sans text-negro mb-4 text-[32px] font-bold sm:text-[40px] md:text-[48px]">
                    IMPRESO
                </h1>
                <p className="font-basic-sans text-negro mb-6 text-[16px] leading-[20px] sm:text-[17px] sm:leading-[21px] md:text-[18px] md:leading-[22px]">
                    Publicación impresa semestral sobre cultura en la x región
                </p>
                <div className="mt-8 sm:mt-10 md:mt-[60px]">
                    <Impresos />
                </div>
            </section>
        </main>
    );
}
