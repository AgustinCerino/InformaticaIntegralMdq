import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import * as nodemailer from 'nodemailer';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const contactRecipient = process.env['CONTACT_FORM_TO'] || 'informaticaintegralmdq@gmail.com';
const smtpUser = process.env['SMTP_USER'];
const smtpPass = process.env['SMTP_PASS'];

const mailTransporter =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : undefined;

type ContactPayload = {
  nombre?: string;
  telefono?: string;
  email?: string;
  servicio?: string;
  mensaje?: string;
};

const toTrimmedText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

app.use(express.json({ limit: '1mb' }));

app.post('/api/contact', async (req, res) => {
  const body = (req.body ?? {}) as ContactPayload;

  const nombre = toTrimmedText(body.nombre);
  const telefono = toTrimmedText(body.telefono);
  const email = toTrimmedText(body.email);
  const servicio = toTrimmedText(body.servicio) || 'Diagnostico general';
  const mensaje = toTrimmedText(body.mensaje);

  if (nombre.length < 2 || telefono.length < 6 || !email.includes('@') || mensaje.length < 12) {
    res.status(400).json({ ok: false, error: 'Datos de contacto invalidos.' });
    return;
  }

  if (!mailTransporter || !smtpUser) {
    res.status(503).json({
      ok: false,
      error: 'El servicio de correo no esta configurado en el servidor.',
    });
    return;
  }

  const submittedAt = new Date().toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  try {
    await mailTransporter.sendMail({
      from: `"Formulario Web Informatica Integral MDQ" <${smtpUser}>`,
      to: contactRecipient,
      replyTo: email,
      subject: `Nueva consulta web: ${nombre}`,
      text: [
        'Nueva consulta recibida desde el formulario web.',
        '',
        `Fecha: ${submittedAt}`,
        `Nombre: ${nombre}`,
        `Telefono: ${telefono}`,
        `Email: ${email}`,
        `Servicio: ${servicio}`,
        '',
        'Mensaje:',
        mensaje,
      ].join('\n'),
      html: `
        <h2>Nueva consulta web</h2>
        <p><strong>Fecha:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(telefono)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(servicio)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(mensaje).replace(/\n/g, '<br/>')}</p>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error enviando formulario de contacto:', error);
    res.status(500).json({ ok: false, error: 'No se pudo enviar la consulta por correo.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
