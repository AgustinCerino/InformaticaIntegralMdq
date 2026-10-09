import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteHeader } from './site-header';

function createHeader(): ComponentFixture<SiteHeader> {
  const fixture = TestBed.createComponent(SiteHeader);
  fixture.componentRef.setInput('activeSection', 'inicio');
  fixture.detectChanges();
  return fixture;
}

function rootOf(fixture: ComponentFixture<SiteHeader>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function pressDocumentKey(key: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
  document.dispatchEvent(event);
  return event;
}

describe('SiteHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SiteHeader] }).compileComponents();
  });

  it('opens and closes the mobile navigation with accessible button state', () => {
    const fixture = createHeader();
    const root = rootOf(fixture);
    const button = root.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const navigation = root.querySelector<HTMLElement>('#primary-navigation')!;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Abrir menú');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(navigation.classList.contains('is-open')).toBe(true);
  });

  it('closes with Escape and restores focus to the menu button', () => {
    const fixture = createHeader();
    const root = rootOf(fixture);
    const button = root.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const firstLink = root.querySelector<HTMLAnchorElement>('.nav-link')!;

    button.click();
    fixture.detectChanges();
    firstLink.focus();
    pressDocumentKey('Escape');
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Abrir menú');
    expect(document.activeElement).toBe(button);
  });

  it('traps Tab and Shift+Tab inside the open navigation', () => {
    const fixture = createHeader();
    const root = rootOf(fixture);
    const button = root.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const lastLink = root.querySelector<HTMLAnchorElement>('.header-cta')!;
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);

    button.click();
    fixture.detectChanges();

    outsideButton.focus();
    const redirectedTab = pressDocumentKey('Tab');
    expect(redirectedTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(button);

    button.focus();
    const reverseTab = pressDocumentKey('Tab', true);
    expect(reverseTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lastLink);

    const forwardTab = pressDocumentKey('Tab');
    expect(forwardTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(button);

    outsideButton.remove();
  });

  it('closes after selecting a section and preserves the anchor target', () => {
    const fixture = createHeader();
    const root = rootOf(fixture);
    const button = root.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const servicesLink = Array.from(root.querySelectorAll<HTMLAnchorElement>('.nav-link')).find(
      (link) => link.getAttribute('href') === '#servicios',
    )!;

    button.click();
    fixture.detectChanges();
    servicesLink.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(servicesLink.getAttribute('href')).toBe('#servicios');
  });
});
