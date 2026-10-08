import { Component, HostListener, input, output, signal } from '@angular/core';
import { navItems } from '../../data/site-content';

@Component({
  selector: 'app-site-header',
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a
          class="brand-link"
          href="#inicio"
          (click)="selectSection('inicio')"
          aria-label="Informática Integral MDQ, inicio"
        >
          <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
            <path d="M9 31V13l13-7 13 7v18l-13 7-13-7Z" />
            <path d="M15 17h14M15 22h9M15 27h14" />
            <circle cx="29" cy="22" r="2" />
          </svg>
          <span class="brand-name">Informática Integral <strong>MDQ</strong></span>
        </a>

        <button
          class="menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="menuOpen() ? 'Cerrar menú' : 'Abrir menú'"
          (click)="menuOpen.update((open) => !open)"
        >
          <span></span><span></span><span></span>
        </button>

        <nav
          id="primary-navigation"
          class="primary-nav"
          [class.is-open]="menuOpen()"
          aria-label="Secciones principales"
        >
          @for (item of items; track item.id) {
            <a
              class="nav-link"
              [href]="'#' + item.id"
              [class.is-active]="activeSection() === item.id"
              [attr.aria-current]="activeSection() === item.id ? 'location' : null"
              (click)="selectSection(item.id)"
              >{{ item.label }}</a
            >
          }
          <a class="header-cta" href="#contacto" (click)="selectSection('contacto')"
            >Solicitar diagnóstico</a
          >
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {
  readonly activeSection = input.required<string>();
  readonly sectionSelected = output<string>();
  protected readonly items = navItems;
  protected readonly menuOpen = signal(false);

  protected selectSection(id: string): void {
    this.sectionSelected.emit(id);
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
