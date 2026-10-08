import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  template: `
    <section class="section hero-section" id="inicio" aria-labelledby="hero-title">
      <div class="section-inner hero-layout reveal-on-scroll is-visible" data-reveal>
        <div class="hero-copy">
          <p class="eyebrow">Infraestructura IT para empresas de Mar del Plata</p>
          <h1 id="hero-title">Tecnología estable para que tu negocio no se detenga.</h1>
          <p class="lead hero-lead">
            Diseñamos, protegemos y mantenemos redes, sistemas y herramientas de trabajo. Te
            ayudamos a resolver problemas actuales y a construir una infraestructura documentada,
            segura y preparada para crecer.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="#contacto">Solicitar diagnóstico</a>
            <a class="button button-secondary" href="#servicios">Conocer servicios</a>
          </div>
          <ul class="trust-points" aria-label="Modalidades y compromisos de atención">
            <li>Soporte remoto y presencial</li>
            <li>Presupuesto antes de implementar</li>
            <li>Documentación de los cambios</li>
          </ul>
        </div>

        <aside
          class="hero-visual reveal-on-scroll"
          data-reveal
          style="--reveal-delay: 100ms"
          aria-label="Nuestro enfoque de trabajo"
        >
          <div class="network-graphic" aria-hidden="true">
            <span class="network-core">II</span>
            <span class="network-node node-one"></span>
            <span class="network-node node-two"></span>
            <span class="network-node node-three"></span>
            <span class="network-line line-one"></span>
            <span class="network-line line-two"></span>
            <span class="network-line line-three"></span>
          </div>
          <p class="availability"><span></span> Atención: lunes a sábado, de 9:00 a 18:00</p>
          <h2>De un problema técnico a un plan claro</h2>
          <p>
            Relevamos red, Wi-Fi, accesos, seguridad y puestos de trabajo. Luego ordenamos las
            mejoras por impacto, riesgo y urgencia.
          </p>
          <dl class="hero-commitments">
            <div>
              <dt>Respuesta inicial</dt>
              <dd>Dentro de 24 horas hábiles</dd>
            </div>
            <div>
              <dt>Antes de comenzar</dt>
              <dd>Alcance y costos definidos</dd>
            </div>
            <div>
              <dt>Al finalizar</dt>
              <dd>Validación y próximos pasos</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  `,
})
export class HeroSection {}
