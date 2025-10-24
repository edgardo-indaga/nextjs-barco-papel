interface HeaderMenu {
    id: number;
    name: string;
    link: string;
}

export const items: HeaderMenu[] = [
    {
        id: 1,
        name: 'Home',
        link: '/',
    },
    {
        id: 2,
        name: 'Revista Impresa',
        link: '/impresos',
    },
    {
        id: 3,
        name: 'Entrevistas',
        link: '/blogs?category=entrevistas',
    },
    {
        id: 4,
        name: 'Artículos',
        link: '/blogs?category=articulos',
    },
    {
        id: 5,
        name: 'Sonidos Local',
        link: '/blogs?category=sonidolocal',
    },
    {
        id: 6,
        name: 'Bitácora Visual',
        link: '/blogs?category=bitacoravisual',
    },
    {
        id: 7,
        name: 'Cartelera',
        link: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || ''}/#cartelera`,
    },
];

export const itemsAlter: HeaderMenu[] = [
    {
        id: 1,
        name: 'Manifiesto',
        link: '/manifiesto',
    },
    {
        id: 2,
        name: 'Quiénes Somos',
        link: '/somos',
    },
];
