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
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

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
  private readonly http = inject(HttpClient);
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
  protected readonly submitError = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'soluciones', label: 'Certificaciones' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'contacto', label: 'Contacto' }
  ];

  protected readonly services = [
    {
      title: 'Administración de redes corporativas',
      description: 'Diseño, implementación y mantenimiento de redes empresariales: VLANs, Wi-Fi profesional, VPN, QoS, monitoreo y documentación.'
    },
    {
      title: 'Ciberseguridad',
      description: 'Controles técnicos para reducir riesgos reales: hardening, control de acceso, segmentación, respuesta ante incidentes y buenas prácticas.'
    },
    {
      title: 'Firewall perimetral a medida',
      description: 'Firewalls de borde personalizados: políticas, filtrado, bloqueo, NAT, VPN, logs y alertas según tu operación.'
    },
    {
      title: 'Desarrollos a medida',
      description: 'Software y automatizaciones adaptadas a tu negocio: integraciones, paneles, procesos internos y herramientas específicas.'
    }
  ];

  protected readonly clients = [
    {
      name: 'Farmacias Riadigos',
      category: 'Salud',
      work: 'Unificación de red entre sucursales, segmentación por áreas y hardening de acceso para mejorar continuidad operativa.',
      image: 'clientes/riadigos.png'
    },
    {
      name: 'Farmacias Palkin',
      category: 'Salud',
      work: 'Rediseño de conectividad interna, estabilización Wi-Fi y soporte de incidentes críticos en puestos de atención.',
      image: 'clientes/palkin2.jpg'
    },
    {
      name: 'Hotel Club del Golf',
      category: 'Hoteleria',
      work: 'Optimización de red para recepción y administración, con mejoras de seguridad perimetral y accesos remotos.',
      image: 'clientes/clubdelgolfhotel.jpg'
    },
    {
      name: 'Coomarpes',
      category: 'Pesca',
      work: 'Soporte técnico y ordenamiento de infraestructura IT para operación administrativa y comunicaciones internas.',
      image: 'clientes/coomarpes.png'
    }
  ];

  protected readonly certifications = [
    {
      title: 'MikroTik Certified Network Associate',
      code: 'MTCNA',
      logo: 'certificaciones/mikrotik-mtcna.svg',
      summary: 'Base sólida en operación y arquitectura de redes MikroTik.',
      topics: [
        'Configuración de routers MikroTik',
        'Administración de redes IP',
        'VLANs y segmentación de red',
        'Routing, NAT y conectividad WAN',
        'Wi-Fi profesional',
        'VPN y acceso remoto seguro'
      ]
    },
    {
      title: 'MikroTik Certified Security Engineer',
      code: 'MTCSE',
      logo: 'certificaciones/mikrotik-mtcse.svg',
      summary: 'Implementación de controles avanzados de seguridad de red.',
      topics: [
        'Firewalls avanzados y políticas por riesgo',
        'Filtrado y control de tráfico',
        'Seguridad perimetral',
        'Protección contra accesos no autorizados',
        'Monitoreo y análisis de eventos'
      ]
    }
  ];

  protected readonly highlights = [
    'Soporte remoto y on-site',
    'Propuestas claras antes de ejecutar cambios',
    'Respuesta rápida ante incidentes',
    'Enfoque en continuidad operativa y seguridad'
  ];

  protected readonly heroStats = [
    { value: '24 hs', label: 'Respuesta inicial' },
    { value: '100%', label: 'Presupuesto previo' },
    { value: 'Red + Seguridad', label: 'Soporte integral' }
  ];

  protected readonly heroChecks = [
    'Administración y documentación de red (mapa, IPs, VLANs, accesos)',
    'VPN segura para trabajo remoto (site-to-site / usuarios)',
    'Hardening básico y segmentación por áreas/roles'
  ];

  protected readonly contactTrust = [
    'Respuesta inicial dentro de las 24 hs hábiles.',
    'No compartimos tus datos con terceros.',
    'Propuesta técnica clara, por etapas y con prioridades.'
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

    if (this.submitError()) {
      this.submitError.set('');
    }
  }

  protected async onContactSubmit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    this.submitAttempted.set(true);
    this.submitSuccess.set(false);
    this.submitError.set('');
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(this.http.post('/api/contact', this.contactForm.getRawValue()));

      this.submitSuccess.set(true);
      this.submitAttempted.set(false);
      this.contactForm.reset({
        nombre: '',
        telefono: '',
        email: '',
        servicio: 'Diagnostico general',
        mensaje: '',
      });
    } catch {
      this.submitError.set('No se pudo enviar la consulta. Intenta de nuevo en unos minutos.');
    } finally {
      this.isSubmitting.set(false);
    }
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

