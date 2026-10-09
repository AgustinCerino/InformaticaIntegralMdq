import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ContactSection } from './contact-section';

interface ContactFormValue {
  nombre: string;
  telefono: string;
  email: string;
  servicio: string;
  mensaje: string;
  website: string;
  privacidad: boolean;
}

const validFormValue: ContactFormValue = {
  nombre: 'Empresa de prueba',
  telefono: '+54 223 555 0000',
  email: '',
  servicio: 'Ciberseguridad',
  mensaje: 'Necesitamos revisar la segmentación actual de la red.',
  website: '',
  privacidad: true,
};

function formOf(fixture: ComponentFixture<ContactSection>): FormGroup {
  return (fixture.componentInstance as unknown as { contactForm: FormGroup }).contactForm;
}

function rootOf(fixture: ComponentFixture<ContactSection>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function fillForm(
  fixture: ComponentFixture<ContactSection>,
  overrides: Partial<ContactFormValue> = {},
): void {
  formOf(fixture).setValue({ ...validFormValue, ...overrides });
  fixture.detectChanges();
}

function submit(fixture: ComponentFixture<ContactSection>): void {
  rootOf(fixture).querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  fixture.detectChanges();
}

describe('ContactSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSection],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('exposes required fields and accessible error relationships', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();

    const name = rootOf(fixture).querySelector<HTMLInputElement>('#contact-name')!;
    const phone = rootOf(fixture).querySelector<HTMLInputElement>('#contact-phone')!;
    const email = rootOf(fixture).querySelector<HTMLInputElement>('#contact-email')!;
    const message = rootOf(fixture).querySelector<HTMLTextAreaElement>('#contact-message')!;
    const privacy = rootOf(fixture).querySelector<HTMLInputElement>('#contact-privacy')!;

    expect(name.required).toBe(true);
    expect(name.getAttribute('aria-required')).toBe('true');
    expect(message.required).toBe(true);
    expect(message.getAttribute('aria-required')).toBe('true');
    expect(privacy.required).toBe(true);
    expect(privacy.getAttribute('aria-required')).toBe('true');
    expect(phone.required).toBe(false);
    expect(email.required).toBe(false);
    expect(phone.getAttribute('aria-describedby')).toContain('contact-channel-help');
    expect(email.getAttribute('aria-describedby')).toContain('contact-channel-help');

    submit(fixture);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe('contact-name-error');
    expect(privacy.getAttribute('aria-describedby')).toBe('contact-privacy-error');
    expect(rootOf(fixture).textContent).toContain('Ingresá un nombre');
  });

  it('requires at least a phone or an email', () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();
    fillForm(fixture, { telefono: '', email: '' });

    submit(fixture);

    const phone = rootOf(fixture).querySelector<HTMLInputElement>('#contact-phone')!;
    const email = rootOf(fixture).querySelector<HTMLInputElement>('#contact-email')!;
    expect(formOf(fixture).hasError('contactChannelRequired')).toBe(true);
    expect(phone.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(phone.getAttribute('aria-describedby')).toContain('contact-channel-error');
    expect(email.getAttribute('aria-describedby')).toContain('contact-channel-error');
    expect(rootOf(fixture).textContent).toContain(
      'Ingresá un teléfono o un email para que podamos responderte',
    );
    TestBed.inject(HttpTestingController).expectNone('/api/contact');
  });

  it('accepts a valid phone without an email', () => {
    const fixture = TestBed.createComponent(ContactSection);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    fillForm(fixture, { email: '' });

    submit(fixture);

    const request = http.expectOne('/api/contact');
    expect(request.request.body.telefono).toBe('+54 223 555 0000');
    expect(request.request.body.email).toBe('');
    request.flush({ ok: true });
    http.verify();
  });

  it('accepts a valid email without a phone and reports success', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    fillForm(fixture, { telefono: '', email: 'consulta@empresa.com' });

    submit(fixture);

    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.telefono).toBe('');
    expect(request.request.body.email).toBe('consulta@empresa.com');
    expect(request.request.body.privacidad).toBeUndefined();
    expect(request.request.body.startedAt).toEqual(expect.any(Number));
    request.flush({ ok: true });

    await fixture.whenStable();
    fixture.detectChanges();
    expect(rootOf(fixture).textContent).toContain('Consulta enviada correctamente');
    http.verify();
  });

  it('rejects an invalid phone when it is provided', () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();
    fillForm(fixture, { telefono: 'teléfono inválido', email: '' });

    submit(fixture);

    expect(rootOf(fixture).textContent).toContain('Ingresá un teléfono válido');
    expect(
      rootOf(fixture)
        .querySelector<HTMLInputElement>('#contact-phone')!
        .getAttribute('aria-describedby'),
    ).toContain('contact-phone-error');
    TestBed.inject(HttpTestingController).expectNone('/api/contact');
  });

  it('rejects an invalid email when it is provided', () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();
    fillForm(fixture, { telefono: '', email: 'correo-inválido' });

    submit(fixture);

    expect(rootOf(fixture).textContent).toContain('Ingresá un email válido');
    expect(
      rootOf(fixture)
        .querySelector<HTMLInputElement>('#contact-email')!
        .getAttribute('aria-describedby'),
    ).toContain('contact-email-error');
    TestBed.inject(HttpTestingController).expectNone('/api/contact');
  });

  it('keeps privacy consent mandatory', () => {
    const fixture = TestBed.createComponent(ContactSection);
    fixture.detectChanges();
    fillForm(fixture, { privacidad: false });

    submit(fixture);

    const privacy = rootOf(fixture).querySelector<HTMLInputElement>('#contact-privacy')!;
    expect(privacy.getAttribute('aria-invalid')).toBe('true');
    expect(privacy.getAttribute('aria-describedby')).toBe('contact-privacy-error');
    expect(rootOf(fixture).textContent).toContain(
      'Necesitamos tu consentimiento para enviar la consulta',
    );
    TestBed.inject(HttpTestingController).expectNone('/api/contact');
  });
});
