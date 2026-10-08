import { Component } from '@angular/core';
import { business } from '../../data/site-content';

@Component({
  selector: 'app-whatsapp-button',
  template: `
    <a
      class="whatsapp-button"
      [href]="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp en una nueva pestaña"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.5 3.5A11.9 11.9 0 0 0 12.1 0 11.9 11.9 0 0 0 1.8 17.8L0 24l6.4-1.7a11.8 11.8 0 0 0 5.7 1.4A11.9 11.9 0 0 0 24 11.9c0-3.2-1.3-6.2-3.5-8.4ZM12.1 21.7a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.9 9.9 0 1 1 8.4 4.7Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2.1-.4 0-.6l-1-2.4c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.3-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.2c.2.2 2.2 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.4Z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>
  `,
})
export class WhatsappButton {
  protected readonly whatsappUrl = business.whatsapp;
}
