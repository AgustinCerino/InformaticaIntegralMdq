import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { business } from '../../data/site-content';

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink],
  template: `
    <a class="skip-link" href="#privacy-content">Saltar al contenido principal</a>
    <header class="legal-header">
      <a
        class="brand-link"
        routerLink="/"
        aria-label="Volver al inicio de Informática Integral MDQ"
      >
        <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
          <path d="M9 31V13l13-7 13 7v18l-13 7-13-7Z" />
          <path d="M15 17h14M15 22h9M15 27h14" />
          <circle cx="29" cy="22" r="2" />
        </svg>
        <span class="brand-name">Informática Integral <strong>MDQ</strong></span>
      </a>
      <a class="button button-secondary" routerLink="/">Volver al sitio</a>
    </header>

    <main id="privacy-content" class="legal-page">
      <p class="eyebrow">Información legal</p>
      <h1>Política de privacidad</h1>
      <p class="legal-updated">Última actualización: 8 de octubre de 2026.</p>

      <section>
        <h2>Responsable y finalidad</h2>
        <p>
          El responsable del tratamiento es {{ company.name }}, con actividad en Mar del Plata,
          provincia de Buenos Aires. Los datos enviados mediante el formulario se utilizan
          exclusivamente para responder consultas, preparar propuestas y continuar una conversación
          solicitada por la persona interesada.
        </p>
      </section>

      <section>
        <h2>Datos que recopilamos</h2>
        <p>
          Nombre, teléfono, email, servicio de interés y el mensaje que decidas incluir. No
          solicitamos datos sensibles.
        </p>
      </section>

      <section>
        <h2>Conservación y destinatarios</h2>
        <p>
          Conservamos la consulta durante un máximo de 12 meses desde la última comunicación, salvo
          que exista una relación contractual u obligación legal que requiera otro plazo. Los
          proveedores de correo y alojamiento pueden procesar la información únicamente para prestar
          esos servicios. No vendemos ni cedemos datos con fines publicitarios.
        </p>
      </section>

      <section>
        <h2>Tus derechos</h2>
        <p>
          Podés solicitar acceso, rectificación, actualización o supresión escribiendo a
          <a [href]="'mailto:' + company.email">{{ company.email }}</a
          >. La solicitud es gratuita y será atendida de acuerdo con la Ley 25.326 de Protección de
          los Datos Personales.
        </p>
        <p>
          Consultá la
          <a
            href="https://www.argentina.gob.ar/aaip/datospersonales/derechos"
            target="_blank"
            rel="noopener noreferrer"
          >
            información oficial de la Agencia de Acceso a la Información Pública </a
          >.
        </p>
      </section>

      <section>
        <h2>Cookies y medición</h2>
        <p>
          Actualmente el sitio no utiliza cookies de publicidad, perfiles de usuario ni herramientas
          de analítica de terceros.
        </p>
      </section>

      <section>
        <h2>Seguridad y cambios</h2>
        <p>
          Aplicamos medidas técnicas razonables para limitar el acceso y el uso indebido de la
          información. Esta política puede actualizarse si cambian el formulario, los proveedores o
          las obligaciones aplicables.
        </p>
      </section>
    </main>
  `,
})
export class PrivacyPage {
  protected readonly company = business;
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Política de privacidad | Informática Integral MDQ',
      description:
        'Cómo Informática Integral MDQ utiliza y protege los datos enviados mediante su formulario de contacto.',
      path: '/politica-de-privacidad',
    });
  }
}
