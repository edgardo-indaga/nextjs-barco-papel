import {
    BookType,
    Calendar,
    LayoutDashboard,
    LifeBuoy,
    Medal,
    Newspaper,
    Settings2,
    Shield,
    Users,
} from 'lucide-react';

export const navData = {
    navMain: [
        {
            title: 'Escritorio',
            url: '/admin/dashboard',
            icon: LayoutDashboard,
            roles: [],
        },
        {
            title: 'Noticias',
            url: '/admin/administration/blog',
            icon: Newspaper,
            roles: [],
        },
        {
            title: 'Cartelera',
            url: '/admin/administration/events',
            icon: Calendar,
            roles: [],
        },
        {
            title: 'Equipo',
            url: '/admin/administration/teams',
            icon: Users,
            roles: [],
        },
        {
            title: 'Patrocinadores',
            url: '/admin/administration/sponsors',
            icon: Medal,
            roles: [],
        },
        {
            title: 'Impresos',
            url: '/admin/administration/materials',
            icon: BookType,
            roles: [],
        },
    ],

    navSetting: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            roles: [],
            items: [
                {
                    title: 'Usuarios',
                    url: '/admin/settings/users',
                    roles: [],
                },
            ],
        },
        {
            title: 'Ayuda',
            url: '/admin/settings/tickets',
            icon: LifeBuoy,
            roles: [],
        },
    ],

    adminSetting: [
        {
            title: 'Privado',
            url: '#',
            icon: Shield,
            roles: ['SuperAdministrador'],
            items: [
                {
                    title: 'Auditoria',
                    url: '/admin/settings/audit',
                    roles: ['SuperAdministrador'],
                },
                {
                    title: 'Permisos',
                    url: '/admin/settings/permissions',
                    roles: ['SuperAdministrador'],
                },
            ],
        },
    ],
};
