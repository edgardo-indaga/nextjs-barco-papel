import Image from 'next/image';
import Link from 'next/link';

import { ForgotPassword } from '@/components/Login/ForgotPassword';

export default function RecoveryPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-3 self-center font-medium">
                    <div className="bg-negro flex aspect-square size-12 items-center justify-center rounded-lg shadow-lg">
                        <span className="text-fucsia text-2xl font-bold">🚢</span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="text-negro truncate text-[20px] font-bold">
                            Barco de Papel
                        </span>
                        <span className="text-fucsia truncate text-[14px] font-medium">
                            Revista Digital
                        </span>
                    </div>
                </Link>
                <ForgotPassword />

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
