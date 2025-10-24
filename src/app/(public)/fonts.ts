import localFont from 'next/font/local';

export const BasicSans = localFont({
    src: [
        {
            path: './fonts/BasicSans-Thin.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: './fonts/BasicSans-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './fonts/BasicSans-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/BasicSans-RegularIt.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: './fonts/BasicSans-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './fonts/BasicSans-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './fonts/BasicSans-Black.woff2',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-basic-sans',
    display: 'swap',
});
