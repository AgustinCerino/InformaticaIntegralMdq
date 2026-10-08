import { Component } from '@angular/core';
import { services } from '../../data/site-content';

@Component({
  selector: 'app-services-section',
  template: `
    <section class="section section-surface" id="servicios" aria-labelledby="services-title">
      <div class="section-inner reveal-on-scroll" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">Qué hacemos</p>
          <h2 id="services-title">Servicios para una operación más confiable</h2>
          <p class="lead">
            Cubrimos el ciclo completo: diagnóstico, implementación, seguridad, monitoreo y soporte.
            Cada propuesta se adapta al tamaño, prioridades y herramientas de tu organización.
          </p>
        </div>

        <div class="services-grid">
          @for (service of serviceList; track service.title; let index = $index) {
            <article
              class="service-card reveal-on-scroll"
              data-reveal
              [style.--reveal-delay]="index * 60 + 40 + 'ms'"
            >
              <div class="service-icon" [attr.data-icon]="service.icon" aria-hidden="true">
                @switch (service.icon) {
                  @case ('network') {
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2.5" />
                      <circle cx="5" cy="18" r="2.5" />
                      <circle cx="19" cy="18" r="2.5" />
                      <path d="M12 7.5v4M6.8 15.9l3.6-3.6M17.2 15.9l-3.6-3.6" />
                    </svg>
                  }
                  @case ('shield') {
                    <svg viewBox="0 0 24 24">
                      <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  }
                  @case ('monitor') {
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="13" rx="2" />
                      <path d="M8 21h8M12 17v4M7 11h2l1.5-3 2.5 6 1.5-3H17" />
                    </svg>
                  }
                  @case ('code') {
                    <svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></svg>
                  }
                }
              </div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <ul>
                @for (item of service.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServicesSection {
  protected readonly serviceList = services;
}
