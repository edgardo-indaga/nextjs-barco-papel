import Image from 'next/image';

export default function ManifiestoPage() {
    const imageHeader = '/image-header-page.png';
    const headerManifiesto = '/header-manifiesto.svg';
    const ojoUno = '/ojo-1.svg';
    const brujula = '/brujula.svg';
    const ojoDos = '/ojo-2.svg';
    const lluviaLetrasUno = '/lluvia-letras.svg';
    const footerManifiesto = '/footer-manifiesto.png';
    const footerBarc = '/footer-barco.png';

    return (
        <main className="bg-web">
            {/* Header images - Desktop only */}
            <section className="md:h-[299px]">
                <Image
                    src={imageHeader}
                    alt="Imagen Header Page"
                    width={2200}
                    height={299}
                    className="h-full w-full object-cover object-top"
                    priority
                />
            </section>

            <section className="hidden md:block md:h-[490px]">
                <Image
                    src={headerManifiesto}
                    alt="Header Manifiesto"
                    width={1930}
                    height={490}
                    className="h-full w-full object-cover object-center"
                />
            </section>

            <section className="container mx-auto max-w-[1100px] px-4 py-[40px] sm:px-6 sm:py-[60px] md:py-[100px]">
                <div className="grid grid-cols-1 gap-[40px] md:grid-cols-12 md:gap-0">
                    <div className="md:col-span-5 md:pr-[40px]">
                        <p className="font-basic-sans py-[15px] text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-[18px] md:leading-[26px]">
                            Nos mueve la{' '}
                            <b>curiosidad, el deseo de comprender y la alegría de descubrir.</b>{' '}
                            Somos una revista que invita a{' '}
                            <b>
                                reflexionar, escuchar y, sobre todo, observar con atención el arte,
                                el patrimonio y las culturas vivas de la Región de Los Lagos
                            </b>
                            . Queremos promover el tiempo de mirar lo cotidiano y lo extraordinario;
                            lo que se hereda, se transforma y se crea en este territorio.
                        </p>
                        <p className="font-basic-sans py-[15px] text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-[18px] md:leading-[26px]">
                            Entendemos las expresiones culturales como{' '}
                            <b>
                                prácticas vivas, que se manifiestan en lo que se canta, se cocina,
                                se pinta, se escribe, se borda y se habita.
                            </b>{' '}
                            Están en las formas de hacer, de transmitir y de relacionarse.
                        </p>
                        <p className="font-basic-sans py-[15px] text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-[18px] md:leading-[26px]">
                            Nos guía una profunda vocación territorial. Nos preguntamos qué es la
                            identidad del territorio y cuántas identidades pueden convivir en él.
                            <b>Queremos explorar qué significa ser de acá</b> —sin prejuicios ni
                            esencialismos— y cómo eso se expresa a través de las culturas del sur.
                        </p>
                        <p className="font-basic-sans py-[15px] text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-[18px] md:leading-[26px]">
                            Barco de papel está dirigido a{' '}
                            <b>
                                personas curiosas, con sensibilidad por el arte, las historias, la
                                memoria y el territorio.
                            </b>{' '}
                            Nuestro público valora las expresiones culturales que nacen desde lo
                            local, disfruta de la reflexión, la belleza cotidiana y las historias
                            bien contadas.
                        </p>
                    </div>

                    {/* Decorative images - Desktop only */}
                    <div className="hidden md:col-span-2 md:flex md:flex-col md:space-y-4">
                        <Image
                            src={ojoUno}
                            alt="Ojo Uno"
                            width={223}
                            height={104}
                            className="h-auto w-[223px]"
                        />
                        <Image
                            src={brujula}
                            alt="Brújula"
                            width={260}
                            height={549}
                            className="my-[40px] h-auto w-[260px]"
                        />
                        <Image
                            src={ojoDos}
                            alt="Ojo Dos"
                            width={223}
                            height={104}
                            className="h-auto w-[223px]"
                        />
                    </div>

                    <div className="md:col-span-5 md:pl-[40px]">
                        {/* Lluvia letras - Desktop only */}
                        <div className="hidden md:mb-0 md:flex md:justify-end">
                            <Image
                                src={lluviaLetrasUno}
                                alt="Lluvia de Letras"
                                width={1672}
                                height={731}
                                className="mt-[-450px] ml-[110px] h-auto w-[300px]"
                            />
                        </div>
                        <p className="font-basic-sans py-[15px] text-center text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-right md:text-[18px] md:leading-[26px]">
                            Creemos en el <b>placer de contar historias.</b> Nos importa la belleza,
                            no como adorno, sino como forma de conectar y cuidar.
                        </p>
                        <p className="font-basic-sans py-[15px] text-center text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-right md:text-[18px] md:leading-[26px]">
                            Barco de papel es <b>un espacio para conversar, narrar y compartir.</b>{' '}
                            Una revista construida <b>desde el sur, entre muchas voces,</b> para
                            acompañar las preguntas que nos hacemos sobre el lugar que habitamos.
                        </p>
                        <p className="font-basic-sans py-[15px] text-center text-[16px] leading-[22px] font-normal sm:text-[17px] sm:leading-[24px] md:text-right md:text-[18px] md:leading-[26px]">
                            Apuntamos a lectoras y lectores que habitan o se{' '}
                            <b>sienten conectados con el sur de Chile</b> —particularmente la Región
                            de Los Lagos—, que buscan espacios editoriales que piensen desde el
                            territorio y no solo sobre él. Personas que{' '}
                            <b>
                                leen, escuchan, crean, educan, cuidan, gestionan, investigan o
                                simplemente observan con atención.
                            </b>
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer - Mobile: footerBarc, Desktop: footerManifiesto */}
            <div className="block md:hidden">
                <Image
                    src={footerBarc}
                    alt="Footer Barco"
                    width={8000}
                    height={2866}
                    className="h-auto w-[100vw]"
                />
            </div>
            <div className="hidden md:mt-[-200px] md:block">
                <Image
                    src={footerManifiesto}
                    alt="Footer Manifiesto"
                    width={8000}
                    height={2866}
                    className="h-auto w-[100vw]"
                />
            </div>
        </main>
    );
}
