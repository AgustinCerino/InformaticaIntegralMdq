import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const indexPath = new URL('../src/index.html', import.meta.url);

test('publishes one valid ProfessionalService JSON-LD entity', async () => {
  const html = await readFile(indexPath, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  assert.equal(scripts.length, 1);
  const structuredData = JSON.parse(scripts[0][1]);
  assert.equal(structuredData['@type'], 'ProfessionalService');
  assert.equal(structuredData.url, 'https://informaticaintegralmdq.vercel.app/');
  assert.equal(structuredData.logo, 'https://informaticaintegralmdq.vercel.app/logoIImdq.ico?v=2');
  assert.equal(structuredData.image, 'https://informaticaintegralmdq.vercel.app/og-cover.png');
  assert.deepEqual(structuredData.address, {
    '@type': 'PostalAddress',
    addressLocality: 'Mar del Plata',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  });
});

test('uses absolute production URLs in static social metadata', async () => {
  const html = await readFile(indexPath, 'utf8');
  assert.match(
    html,
    /<meta\s+property="og:url"\s+content="https:\/\/informaticaintegralmdq\.vercel\.app\/"\s*\/?>/,
  );
  assert.equal(
    html.match(/https:\/\/informaticaintegralmdq\.vercel\.app\/og-cover\.png/g)?.length,
    3,
  );
});
