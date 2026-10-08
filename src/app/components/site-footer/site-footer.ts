import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { business } from '../../data/site-content';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <a class="footer-brand" href="#inicio">Informática Integral <strong>MDQ</strong></a>
          <p>Redes, seguridad, monitoreo y soporte para empresas.</p>
        </div>
        <nav aria-label="Información legal">
          <a routerLink="/politica-de-privacidad">Privacidad</a>
          <a [href]="'mailto:' + company.email">Email</a>
          <a [href]="company.whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </nav>
        <p class="copyright">© {{ currentYear }} {{ company.name }}</p>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly company = business;
  protected readonly currentYear = new Date().getFullYear();
}
