import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '[class.motion-enhanced]': 'motionEnhanced()'
  }
})
export class App implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private sectionObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;
  private pendingNavIndicatorFrame?: number;

  @ViewChild('topNav')
  private topNav?: ElementRef<HTMLElement>;

  protected readonly activeSection = signal('inicio');
  protected readonly motionEnhanced = signal(false);
  protected readonly navIndicatorLeft = signal(0);
  protected readonly navIndicatorWidth = signal(0);
  protected readonly submitAttempted = signal(false);
  protected readonly submitSuccess = signal(false);

  protected readonly navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'soluciones', label: 'Soluciones' },
    { id: 'proceso', label: 'Proceso' },
    { id: 'contacto', label: 'Contacto' }
  ];

  protected readonly services = [
    {
      title: 'Reparacion de PCs y notebooks',
      description: 'Diagnostico, cambio de partes, limpieza interna y optimizacion general.'
    },
    {
      title: 'Instalacion de software',
      description: 'Windows, drivers, Office, programas esenciales y configuracion inicial.'
    },
    {
      title: 'Eliminacion de virus',
      description: 'Limpieza de malware, proteccion basica y mejora de rendimiento.'
    },
    {
      title: 'Redes y Wi-Fi',
      description: 'Configuracion de router, repetidores, impresoras y red domestica.'
    }
  ];

  protected readonly process = [
    'Nos contactas por WhatsApp o telefono',
    'Hacemos diagnostico y presupuesto',
    'Reparamos y configuramos el equipo',
    'Entregamos y damos recomendaciones de uso'
  ];

  protected readonly highlights = [
    'Atencion a domicilio y remota',
    'Presupuestos claros antes de reparar',
    'Respuesta rapida para urgencias',
    'Soporte para hogares y pequenos negocios'
  ];

  protected readonly heroStats = [
    { value: '24 hs', label: 'Respuesta inicial' },
    { value: '100%', label: 'Presupuesto previo' },
    { value: 'PC + Red', label: 'Soporte integral' }
  ];

  protected readonly heroChecks = [
    'Limpieza y mantenimiento preventivo',
    'Actualizacion de sistema y drivers',
    'Configuracion de Wi-Fi, impresoras y perifericos'
  ];

  protected readonly contactForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    servicio: ['Diagnostico general', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(12)]],
  });

  protected readonly contactControls = this.contactForm.controls;

  constructor() {
    effect(() => {
      this.activeSection();
      this.queueNavIndicatorUpdate();
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const host = this.hostElement.nativeElement as HTMLElement;
    const sections = Array.from(host.querySelectorAll('section[id]')) as HTMLElement[];
    const revealTargets = Array.from(host.querySelectorAll('[data-reveal]')) as HTMLElement[];

    if (sections.length === 0) {
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          (entry.target as HTMLElement).classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -12% 0px'
      }
    );

    for (const target of revealTargets) {
      this.revealObserver.observe(target);
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          return;
        }

        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const mostVisible = visibleEntries[0]?.target as HTMLElement | undefined;

        if (mostVisible?.id) {
          this.setActiveSection(mostVisible.id);
        }
      },
      {
        threshold: [0.25, 0.45, 0.7],
        rootMargin: '-20% 0px -45% 0px'
      }
    );

    for (const section of sections) {
      this.sectionObserver.observe(section);
    }

    this.motionEnhanced.set(true);
    this.queueNavIndicatorUpdate();

    const viewportMark = window.innerHeight * 0.92;
    for (const target of revealTargets) {
      if (target.getBoundingClientRect().top < viewportMark) {
        target.classList.add('is-visible');
      }
    }

    if ('fonts' in document) {
      void (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => {
        this.queueNavIndicatorUpdate();
      });
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.revealObserver?.disconnect();

    if (typeof window !== 'undefined' && this.pendingNavIndicatorFrame !== undefined) {
      window.cancelAnimationFrame(this.pendingNavIndicatorFrame);
      this.pendingNavIndicatorFrame = undefined;
    }
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.queueNavIndicatorUpdate();
  }

  protected setActiveSection(id: string): void {
    if (this.activeSection() !== id) {
      this.activeSection.set(id);
      return;
    }

    this.queueNavIndicatorUpdate();
  }

  protected clearSubmitSuccess(): void {
    if (this.submitSuccess()) {
      this.submitSuccess.set(false);
    }
  }

  protected onContactSubmit(): void {
    this.submitAttempted.set(true);
    this.submitSuccess.set(false);
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    this.submitSuccess.set(true);
    this.submitAttempted.set(false);

    this.contactForm.reset({
      nombre: '',
      telefono: '',
      email: '',
      servicio: 'Diagnostico general',
      mensaje: ''
    });
  }

  private queueNavIndicatorUpdate(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.pendingNavIndicatorFrame !== undefined) {
      window.cancelAnimationFrame(this.pendingNavIndicatorFrame);
    }

    this.pendingNavIndicatorFrame = window.requestAnimationFrame(() => {
      this.pendingNavIndicatorFrame = undefined;
      this.updateNavIndicator();
    });
  }

  private updateNavIndicator(): void {
    const nav = this.topNav?.nativeElement;

    if (!nav) {
      return;
    }

    const activeLink = nav.querySelector('.top-nav-link.is-active') as HTMLElement | null;

    if (!activeLink) {
      this.navIndicatorWidth.set(0);
      return;
    }

    this.navIndicatorLeft.set(activeLink.offsetLeft);
    this.navIndicatorWidth.set(activeLink.offsetWidth);
  }
}
