import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { CertificationsSection } from '../../components/certifications-section/certifications-section';
import { ClientsSection } from '../../components/clients-section/clients-section';
import { ContactSection } from '../../components/contact-section/contact-section';
import { HeroSection } from '../../components/hero-section/hero-section';
import { ProcessSection } from '../../components/process-section/process-section';
import { ServicesSection } from '../../components/services-section/services-section';
import { SiteFooter } from '../../components/site-footer/site-footer';
import { SiteHeader } from '../../components/site-header/site-header';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    SiteHeader,
    HeroSection,
    ServicesSection,
    ProcessSection,
    CertificationsSection,
    ClientsSection,
    ContactSection,
    SiteFooter,
    WhatsappButton,
  ],
  template: `
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <app-site-header
      [activeSection]="activeSection()"
      (sectionSelected)="activeSection.set($event)"
    />
    <main id="main-content">
      <app-hero-section />
      <app-services-section />
      <app-process-section />
      <app-certifications-section />
      <app-clients-section />
      <app-contact-section />
    </main>
    <app-site-footer />
    <app-whatsapp-button />
  `,
  host: {
    '[class.motion-enhanced]': 'motionEnhanced()',
  },
})
export class LandingPage implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly seo = inject(SeoService);
  private readonly sectionVisibility = new Map<Element, number>();
  private sectionObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;

  protected readonly activeSection = signal('inicio');
  protected readonly motionEnhanced = signal(false);

  constructor() {
    this.seo.update({
      title: 'Informática Integral MDQ | Redes, seguridad y soporte IT',
      description:
        'Redes corporativas, ciberseguridad, monitoreo, soporte técnico y desarrollos a medida para empresas de Mar del Plata.',
      path: '/',
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const sections = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('section[id]'),
    );
    const revealTargets = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]'),
    );

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );

    for (const target of revealTargets) this.revealObserver.observe(target);

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.sectionVisibility.set(
            entry.target,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        const visibleSection = [...this.sectionVisibility.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1])[0]?.[0] as HTMLElement | undefined;

        if (visibleSection?.id) this.activeSection.set(visibleSection.id);
      },
      { threshold: [0.08, 0.2, 0.4, 0.65], rootMargin: '-15% 0px -55% 0px' },
    );

    for (const section of sections) {
      this.sectionVisibility.set(section, 0);
      this.sectionObserver.observe(section);
    }

    this.motionEnhanced.set(true);
    const viewportLimit = window.innerHeight * 0.95;
    for (const target of revealTargets) {
      if (target.getBoundingClientRect().top < viewportLimit) target.classList.add('is-visible');
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.revealObserver?.disconnect();
  }
}
