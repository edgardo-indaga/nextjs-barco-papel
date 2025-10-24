export default function sitemap() {
    return [
        {
            url: 'https://www.barcodepapel.cl/',
            lastModified: new Date('2025-07-21'),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://www.barcodepapel.cl/blogs',
            lastModified: new Date('2025-07-21'),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://www.barcodepapel.cl/impresos',
            lastModified: new Date('2025-07-21'),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://www.barcodepapel.cl/manifiesto',
            lastModified: new Date('2025-07-21'),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: 'https://www.barcodepapel.cl/somos',
            lastModified: new Date('2025-07-21'),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];
}
