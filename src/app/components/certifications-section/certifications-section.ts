import { Component } from '@angular/core';
import { certifications } from '../../data/site-content';

@Component({
  selector: 'app-certifications-section',
  template: `
    <section
      class="section section-surface"
      id="certificaciones"
      aria-labelledby="certifications-title"
    >
      <div class="section-inner reveal-on-scroll" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">Formación técnica</p>
          <h2 id="certifications-title">Certificaciones que respaldan el trabajo</h2>
          <p class="lead">
            Formación oficial en networking, seguridad y monitoreo aplicada al diseño y operación de
            infraestructura IT.
          </p>
        </div>
        <div class="certifications-grid">
          @for (certification of certificationList; track certification.code; let index = $index) {
            <article
              class="certification-card reveal-on-scroll"
              data-reveal
              [style.--reveal-delay]="index * 70 + 40 + 'ms'"
            >
              <div class="certification-logo">
                <img
                  [src]="certification.logo"
                  [alt]="'Certificación ' + certification.code"
                  [attr.width]="certification.width"
                  [attr.height]="certification.height"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span class="certification-code">{{ certification.code }}</span>
              <h3>{{ certification.title }}</h3>
              <p>{{ certification.summary }}</p>
              <ul class="check-list">
                @for (topic of certification.topics; track topic) {
                  <li>{{ topic }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class CertificationsSection {
  protected readonly certificationList = certifications;
}
