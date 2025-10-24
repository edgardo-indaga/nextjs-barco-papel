import { Instagram, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    const logoFooter = '/logo-footer.svg';
    const logoMinisterior = '/logo-ministerio.svg';

    return (
        <footer className="bg-azul">
            <div className="container mx-auto max-w-[1100px] px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 sm:gap-4 sm:py-6 md:h-[160px] md:items-center md:py-0">
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={logoMinisterior}
                            alt="Logo Ministerio"
                            width={245}
                            height={91}
                            className="w-[120px] sm:w-[140px] md:w-[180px]"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src={logoFooter}
                            alt="Logo Footer"
                            width={341}
                            height={143}
                            className="w-[140px] sm:w-[180px] md:w-[220px]"
                        />
                    </div>
                    <div className="flex justify-center sm:justify-end">
                        <a
                            href="https://www.instagram.com/revistabarcodepapel/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-negro mr-[6px] rounded-[50%] p-[5px] transition-transform hover:scale-110 sm:mr-[8px] sm:p-[6px]"
                        >
                            <Instagram size={20} className="text-blanco sm:size-6" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/barco-de-papel/about/?viewAsMember=true"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-negro mr-[6px] rounded-[50%] p-[5px] transition-transform hover:scale-110 sm:mr-[8px] sm:p-[6px]"
                        >
                            <Linkedin size={20} className="text-blanco sm:size-6" />
                        </a>
                        <a
                            href="mailto:catabilleke@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-negro ml-[6px] rounded-[50%] p-[5px] transition-transform hover:scale-110 sm:ml-[8px] sm:p-[6px]"
                        >
                            <Mail size={20} className="text-blanco sm:size-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
