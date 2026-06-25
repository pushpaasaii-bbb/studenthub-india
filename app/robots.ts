import { MetadataRoute } from 'next'

// ============================================
// ROBOTS.TXT GENERATOR
// Tells Google and other search engines
// exactly what to crawl and what to skip
// ============================================

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studenthubindia.com'

  return {
    rules: [
      {
        // Allow ALL search engines to crawl everything
        userAgent: '*',
        allow: [
          '/',
          '/colleges/',
          '/exams/',
          '/jobs/',
          '/tools/',
          '/scholarships/',
          '/study-materials/',
        ],
        disallow: [
          // Block private user pages from Google
          '/dashboard/',
          '/auth/',
          '/api/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        // Special rule for Googlebot
        // Allow everything public
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/colleges/',
          '/exams/',
          '/jobs/',
          '/tools/',
          '/scholarships/',
          '/study-materials/',
        ],
        disallow: [
          '/dashboard/',
          '/auth/',
          '/api/',
        ],
      },
    ],

    // Point Google to your sitemap
    // So it finds all 800+ pages automatically
    sitemap: `${baseUrl}/sitemap.xml`,

    // Site host
    host: baseUrl,
  }
}