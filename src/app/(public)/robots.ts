export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/private/',
            },
        ],
        sitemaps: ['https://www.barcodepapel.cl/sitemap.xml'],
    };
}
