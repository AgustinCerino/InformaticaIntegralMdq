import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactSection } from './contact-section';

describe('ContactSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSection],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('shows accessible validation errors and focuses the first invalid field', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const name = fixture.nativeElement.querySelector('#contact-name') as HTMLInputElement;
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe('contact-name-error');
    expect(fixture.nativeElement.textContent).toContain('Ingresá un nombre');
  });

  it('sends only the required contact payload and reports success', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    const component = fixture.componentInstance as unknown as {
      contactForm: {
        setValue(value: Record<string, string | boolean>): void;
      };
    };
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    component.contactForm.setValue({
      nombre: 'Empresa de prueba',
      telefono: '+54 223 555 0000',
      email: 'consulta@empresa.com',
      servicio: 'Ciberseguridad',
      mensaje: 'Necesitamos revisar la segmentación actual de la red.',
      website: '',
      privacidad: true,
    });
    fixture.nativeElement.querySelector('button[type="submit"]').click();

    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.privacidad).toBeUndefined();
    expect(request.request.body.startedAt).toEqual(expect.any(Number));
    request.flush({ ok: true });

    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Consulta enviada correctamente');
    http.verify();
  });
});
