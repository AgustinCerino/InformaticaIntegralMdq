import { Component, ElementRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContactApiService } from '../../core/contact/contact-api.service';
import { business, contactServiceOptions } from '../../data/site-content';

type ContactControlName = 'nombre' | 'telefono' | 'email' | 'servicio' | 'mensaje' | 'privacidad';

function requirePhoneOrEmail(control: AbstractControl): ValidationErrors | null {
  const phone = String(control.get('telefono')?.value ?? '').trim();
  const email = String(control.get('email')?.value ?? '').trim();
  return phone || email ? null : { contactChannelRequired: true };
}

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="section contact-section" id="contacto" aria-labelledby="contact-title">
      <div class="section-inner contact-layout reveal-on-scroll" data-reveal>
        <div class="contact-copy">
          <p class="eyebrow">Contacto</p>
          <h2 id="contact-title">Contanos qué necesitás resolver</h2>
          <p class="lead">
            Describí brevemente tu situación y objetivo. Te responderemos con preguntas concretas y
            un próximo paso claro.
          </p>

          <address class="contact-details">
            <div>
              <span class="contact-label">WhatsApp y teléfono</span>
              @for (phone of company.phones; track phone.href) {
                <a [href]="phone.href">{{ phone.display }}</a>
              }
            </div>
            <div>
              <span class="contact-label">Email</span>
              <a [href]="'mailto:' + company.email">{{ company.email }}</a>
            </div>
            <div>
              <span class="contact-label">Atención</span>
              <p>{{ company.hours }}</p>
              <p>{{ company.serviceArea }}</p>
            </div>
          </address>
        </div>

        <form
          class="contact-form"
          [formGroup]="contactForm"
          (ngSubmit)="submit()"
          (input)="clearFeedback()"
          (change)="clearFeedback()"
          novalidate
        >
          <div class="form-heading">
            <p class="form-kicker">Solicitud inicial</p>
            <h3>Solicitar diagnóstico</h3>
            <p>Los campos marcados con * son obligatorios.</p>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="contact-name">Nombre *</label>
              <input
                id="contact-name"
                type="text"
                formControlName="nombre"
                autocomplete="name"
                maxlength="80"
                required
                aria-required="true"
                [attr.aria-invalid]="isInvalid('nombre')"
                [attr.aria-describedby]="isInvalid('nombre') ? 'contact-name-error' : null"
              />
              @if (isInvalid('nombre')) {
                <p id="contact-name-error" class="field-error">
                  Ingresá un nombre de entre 2 y 80 caracteres.
                </p>
              }
            </div>

            <div class="field">
              <label for="contact-phone">Teléfono o WhatsApp</label>
              <input
                id="contact-phone"
                type="tel"
                formControlName="telefono"
                autocomplete="tel"
                inputmode="tel"
                maxlength="32"
                placeholder="223 555 0000"
                [attr.aria-invalid]="isInvalid('telefono')"
                [attr.aria-describedby]="contactDescribedBy('telefono')"
              />
              <p id="contact-channel-help" class="field-guidance">
                Completá al menos teléfono o email.
              </p>
              @if (hasFormatError('telefono')) {
                <p id="contact-phone-error" class="field-error">Ingresá un teléfono válido.</p>
              }
            </div>

            <div class="field">
              <label for="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                formControlName="email"
                autocomplete="email"
                maxlength="254"
                placeholder="nombre&#64;empresa.com"
                [attr.aria-invalid]="isInvalid('email')"
                [attr.aria-describedby]="contactDescribedBy('email')"
              />
              @if (hasFormatError('email')) {
                <p id="contact-email-error" class="field-error">Ingresá un email válido.</p>
              }
              @if (isContactChannelMissing()) {
                <p id="contact-channel-error" class="field-error">
                  Ingresá un teléfono o un email para que podamos responderte.
                </p>
              }
            </div>

            <div class="field">
              <label for="contact-service">Servicio *</label>
              <select
                id="contact-service"
                formControlName="servicio"
                required
                aria-required="true"
                [attr.aria-invalid]="isInvalid('servicio')"
              >
                @for (service of serviceOptions; track service) {
                  <option [value]="service">{{ service }}</option>
                }
              </select>
            </div>

            <div class="field field-full">
              <label for="contact-message">Mensaje *</label>
              <textarea
                id="contact-message"
                rows="5"
                formControlName="mensaje"
                maxlength="2000"
                required
                aria-required="true"
                placeholder="Situación actual, cantidad aproximada de equipos o sedes y objetivo principal."
                [attr.aria-invalid]="isInvalid('mensaje')"
                [attr.aria-describedby]="
                  isInvalid('mensaje')
                    ? 'contact-message-error contact-message-help'
                    : 'contact-message-help'
                "
              ></textarea>
              <div class="field-meta">
                <p id="contact-message-help">Entre 12 y 2.000 caracteres.</p>
                <span>{{ contactForm.controls.mensaje.value.length }}/2000</span>
              </div>
              @if (isInvalid('mensaje')) {
                <p id="contact-message-error" class="field-error">
                  Describí la consulta con al menos 12 caracteres.
                </p>
              }
            </div>

            <div class="honeypot" aria-hidden="true">
              <label for="contact-website">No completar</label>
              <input
                id="contact-website"
                type="text"
                formControlName="website"
                autocomplete="off"
                tabindex="-1"
              />
            </div>

            <div class="field field-full consent-field" [class.has-error]="isInvalid('privacidad')">
              <label for="contact-privacy">
                <input
                  id="contact-privacy"
                  type="checkbox"
                  formControlName="privacidad"
                  required
                  aria-required="true"
                  [attr.aria-invalid]="isInvalid('privacidad')"
                  [attr.aria-describedby]="isInvalid('privacidad') ? 'contact-privacy-error' : null"
                />
                <span>
                  Acepto que mis datos se usen únicamente para responder esta consulta. Leí la
                  <a routerLink="/politica-de-privacidad">política de privacidad</a>.<span
                    aria-hidden="true"
                  >
                    *</span
                  >
                </span>
              </label>
              @if (isInvalid('privacidad')) {
                <p id="contact-privacy-error" class="field-error">
                  Necesitamos tu consentimiento para enviar la consulta.
                </p>
              }
            </div>
          </div>

          <div class="form-actions">
            <button class="button button-primary" type="submit" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Enviando…' : 'Enviar consulta' }}
            </button>
            <p>No compartimos tus datos con fines comerciales.</p>
          </div>

          @if (submitSuccess()) {
            <p class="form-status success" role="status" aria-live="polite">
              Consulta enviada correctamente. Te responderemos a la brevedad.
            </p>
          }
          @if (submitError()) {
            <p class="form-status error" role="alert">{{ submitError() }}</p>
          }
        </form>
      </div>
    </section>
  `,
})
export class ContactSection {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ContactApiService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private startedAt = Date.now();

  protected readonly company = business;
  protected readonly serviceOptions = contactServiceOptions;
  protected readonly submitAttempted = signal(false);
  protected readonly submitSuccess = signal(false);
  protected readonly submitError = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly contactForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      telefono: [
        '',
        [Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^[0-9+().\-\s]+$/)],
      ],
      email: ['', [Validators.email, Validators.maxLength(254)]],
      servicio: [contactServiceOptions[0], [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(2000)]],
      website: [''],
      privacidad: [false, [Validators.requiredTrue]],
    },
    { validators: requirePhoneOrEmail },
  );

  protected isInvalid(controlName: ContactControlName): boolean {
    const control = this.contactForm.controls[controlName];
    const interacted = control.touched || this.submitAttempted();
    if ((controlName === 'telefono' || controlName === 'email') && this.isContactChannelMissing()) {
      return true;
    }
    return control.invalid && interacted;
  }

  protected hasFormatError(controlName: 'telefono' | 'email'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && (control.touched || this.submitAttempted());
  }

  protected isContactChannelMissing(): boolean {
    const interacted =
      this.contactForm.controls.telefono.touched ||
      this.contactForm.controls.email.touched ||
      this.submitAttempted();
    return this.contactForm.hasError('contactChannelRequired') && interacted;
  }

  protected contactDescribedBy(controlName: 'telefono' | 'email'): string {
    const descriptions = ['contact-channel-help'];
    if (this.hasFormatError(controlName))
      descriptions.push(`contact-${controlName === 'telefono' ? 'phone' : 'email'}-error`);
    if (this.isContactChannelMissing()) descriptions.push('contact-channel-error');
    return descriptions.join(' ');
  }

  protected clearFeedback(): void {
    this.submitSuccess.set(false);
    this.submitError.set('');
  }

  protected async submit(): Promise<void> {
    if (this.isSubmitting()) return;

    this.submitAttempted.set(true);
    this.clearFeedback();
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.focusFirstInvalidControl();
      return;
    }

    const { privacidad: _privacyAccepted, ...formValue } = this.contactForm.getRawValue();
    this.isSubmitting.set(true);

    try {
      await firstValueFrom(this.api.send({ ...formValue, startedAt: this.startedAt }));
      this.submitSuccess.set(true);
      this.submitAttempted.set(false);
      this.contactForm.reset({
        nombre: '',
        telefono: '',
        email: '',
        servicio: contactServiceOptions[0],
        mensaje: '',
        website: '',
        privacidad: false,
      });
      this.startedAt = Date.now();
    } catch {
      this.submitError.set(
        'No pudimos enviar la consulta. Intentá nuevamente en unos minutos o comunicate por WhatsApp.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private focusFirstInvalidControl(): void {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }
}
