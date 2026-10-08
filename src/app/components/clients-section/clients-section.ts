import { Component } from '@angular/core';
import { clientCases } from '../../data/site-content';

@Component({
  selector: 'app-clients-section',
  template: `
    <section class="section clients-section" id="clientes" aria-labelledby="clients-title">
      <div class="section-inner reveal-on-scroll" data-reveal>
        <div class="section-heading">
          <p class="eyebrow">Experiencia</p>
          <h2 id="clients-title">Organizaciones que confiaron en nuestro trabajo</h2>
          <p class="lead">
            Implementaciones adaptadas a contextos donde la conectividad y el soporte forman parte
            de la operación diaria.
          </p>
        </div>
        <div class="clients-grid">
          @for (client of clients; track client.name; let index = $index) {
            <article
              class="client-card reveal-on-scroll"
              data-reveal
              [style.--reveal-delay]="index * 60 + 40 + 'ms'"
            >
              <div class="client-logo">
                <img
                  [src]="client.image"
                  [alt]="'Logo de ' + client.name"
                  [attr.width]="client.width"
                  [attr.height]="client.height"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="client-content">
                <span class="tag">{{ client.category }}</span>
                <h3>{{ client.name }}</h3>
                <p>{{ client.work }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ClientsSection {
  protected readonly clients = clientCases;
}
