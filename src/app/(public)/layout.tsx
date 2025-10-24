import '../globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Footer from '@/components/Home/Footer/Footer';
import DynamicHeader from '@/components/Home/Header/DynamicHeader';
import { BasicSans } from './fonts';

export const metadata: Metadata = {
    title: 'Barco de Papel',
    description:
        'Somos una revista que invita a reflexionar, escuchar y, sobre todo, observar con atención el arte, el patrimonio y las culturas vivas de la Región de Los Lagos.',
    icons: {
        icon: '/favicon.ico',
        apple: '/favicon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon.png',
        },
    },
    generator: 'Next.js',
    applicationName: 'WebPage Crow Advance',
    authors: [{ name: 'Edgardo Ruotolo Cardozo', url: 'https://crowadvance.com' }],
    creator: 'Edgardo Ruotolo Cardozo',
    publisher: 'Edgardo Ruotolo Cardozo',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${BasicSans.variable} antialiased`}>
            <body>
                <DynamicHeader />
                <main>{children}</main>
                <Footer />
            </body>
            <GoogleAnalytics gaId="G-DBJPKRXM86" />
        </html>
    );
}
