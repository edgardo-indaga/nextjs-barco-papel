import Image from 'next/image';
import Link from 'next/link';

const logo: string = '/logo-sm-wh.svg';

import {ForgotPassword} from '@/components/Login/ForgotPassword';

export default function RecoveryPage() {
    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-3 self-center font-medium">
                    <div
                        className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={480}
                            height={473}
                            className="h-[23px] w-[24px]"
                        />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-[16px] font-semibold">Chubby</span>
                        <span className="truncate text-[11px]">Dashboard</span>
                    </div>
                </Link>
                <ForgotPassword/>

                {/* Footer con información adicional */}
                <div className="text-center">
                    <p className="text-[12px] leading-relaxed text-gray-600">
                        ¿Necesitas ayuda? Contacta a{' '}
                        <a
                            href="mailto:catabilleke@gmail.com"
                            className="text-fucsia font-medium hover:underline"
                        >
                            catabilleke@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
