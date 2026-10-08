import { Component } from '@angular/core';
import { processSteps } from '../../data/site-content';

@Component({
  selector: 'app-process-section',
  template: `
    <section class="section process-section" id="metodo" aria-labelledby="process-title">
      <div class="section-inner reveal-on-scroll" data-reveal>
        <div class="section-heading compact-heading">
          <p class="eyebrow">Cómo trabajamos</p>
          <h2 id="process-title">Orden, claridad y continuidad</h2>
          <p class="lead">
            Un proceso simple para saber qué se hará, por qué y qué resultado esperar.
          </p>
        </div>
        <ol class="process-grid">
          @for (step of steps; track step.number; let index = $index) {
            <li
              class="process-card reveal-on-scroll"
              data-reveal
              [style.--reveal-delay]="index * 70 + 40 + 'ms'"
            >
              <span class="process-number">{{ step.number }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class ProcessSection {
  protected readonly steps = processSteps;
}
