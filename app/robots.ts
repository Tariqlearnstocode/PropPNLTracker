import type { MetadataRoute } from 'next';
import { getURL } from '@/utils/helpers';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getURL();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/settings', '/connect'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
