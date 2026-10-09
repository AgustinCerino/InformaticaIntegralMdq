import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('uses absolute social URLs and updates route metadata without duplicates', () => {
    const service = TestBed.inject(SeoService);
    const document = TestBed.inject(DOCUMENT);

    service.update({
      title: 'Inicio',
      description: 'Descripción inicial',
      path: '/',
    });
    service.update({
      title: 'Privacidad',
      description: 'Descripción legal',
      path: '/politica-de-privacidad',
    });

    expect(document.querySelectorAll('meta[property="og:url"]')).toHaveLength(1);
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://informaticaintegralmdq.vercel.app/politica-de-privacidad',
    );
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://informaticaintegralmdq.vercel.app/og-cover.png',
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://informaticaintegralmdq.vercel.app/og-cover.png',
    );
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://informaticaintegralmdq.vercel.app/politica-de-privacidad',
    );
  });
});
