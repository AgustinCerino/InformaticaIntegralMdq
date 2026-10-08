import { writeFile } from 'node:fs/promises';

const configuredUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (!configuredUrl) {
  console.log('SEO: SITE_URL no definido; se conserva robots.txt sin referencia a sitemap.');
  process.exit(0);
}

const baseUrl = configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`;
const normalized = baseUrl.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${normalized}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${normalized}/politica-de-privacidad</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${normalized}/sitemap.xml
`;

await Promise.all([
  writeFile('public/sitemap.xml', sitemap, 'utf8'),
  writeFile('public/robots.txt', robots, 'utf8'),
]);
console.log(`SEO: sitemap generado para ${normalized}`);
