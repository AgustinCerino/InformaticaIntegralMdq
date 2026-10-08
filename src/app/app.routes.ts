import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing-page').then((module) => module.LandingPage),
    title: 'Informática Integral MDQ | Redes, seguridad y soporte IT',
  },
  {
    path: 'politica-de-privacidad',
    loadComponent: () =>
      import('./pages/privacy/privacy-page').then((module) => module.PrivacyPage),
    title: 'Política de privacidad | Informática Integral MDQ',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
