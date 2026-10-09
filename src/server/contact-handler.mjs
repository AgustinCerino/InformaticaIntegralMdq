import nodemailer from 'nodemailer';

const DEFAULT_RECIPIENT = 'informaticaintegralmdq@gmail.com';
const BODY_LIMIT_BYTES = 20_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_FORM_COMPLETION_MS = 2_000;
const attemptsByIp = new Map();

const allowedServices = new Set([
  'Diagnóstico general',
  'Administración de redes corporativas',
  'Ciberseguridad',
  'Monitoreo y soporte técnico',
  'Desarrollos a medida',
  'Otro',
]);

function text(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength + 1);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function header(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function clientIp(req) {
  const forwarded = header(req, 'x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function isSameOrigin(req) {
  const origin = header(req, 'origin');
  if (!origin) return true;

  const forwardedHost = header(req, 'x-forwarded-host');
  const host = forwardedHost || header(req, 'host');
  if (!host) return false;

  const forwardedProto = header(req, 'x-forwarded-proto');
  const protocol = forwardedProto || (req.socket?.encrypted ? 'https' : 'http');
  const expected = `${protocol}://${host}`;
  return origin === expected;
}

function isRateLimited(ip) {
  const now = Date.now();
  for (const [key, value] of attemptsByIp) {
    if (now - value.startedAt > RATE_LIMIT_WINDOW_MS) attemptsByIp.delete(key);
  }

  const current = attemptsByIp.get(ip);
  if (!current || now - current.startedAt > RATE_LIMIT_WINDOW_MS) {
    attemptsByIp.set(ip, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function setHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Allow', 'POST, OPTIONS');
}

function respond(res, status, body) {
  res.status(status).json(body);
}

export function validateContactPayload(body) {
  const nombre = text(body?.nombre, 80);
  const telefono = text(body?.telefono, 32);
  const email = text(body?.email, 254).toLowerCase();
  const servicio = text(body?.servicio, 80);
  const mensaje = text(body?.mensaje, 2000);
  const website = text(body?.website, 200);
  const startedAt = Number(body?.startedAt);

  if (website) return { bot: true };
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_COMPLETION_MS) return null;
  if (nombre.length < 2 || nombre.length > 80 || /[\r\n\0]/.test(nombre)) return null;
  if (!telefono && !email) return null;
  if (telefono && !/^[0-9+().\-\s]{6,32}$/.test(telefono)) return null;
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || /[\r\n\0]/.test(email))) {
    return null;
  }
  if (!allowedServices.has(servicio)) return null;
  if (mensaje.length < 12 || mensaje.length > 2000 || /\0/.test(mensaje)) return null;

  return { nombre, telefono, email, servicio, mensaje, bot: false };
}

function createTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
  });
}

export async function handleContactRequest(req, res) {
  setHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    respond(res, 405, { ok: false, error: 'Método no permitido.' });
    return;
  }

  const contentType = header(req, 'content-type') || '';
  const contentLength = Number(header(req, 'content-length') || 0);
  if (
    !contentType.toLowerCase().startsWith('application/json') ||
    contentLength > BODY_LIMIT_BYTES
  ) {
    respond(res, 415, { ok: false, error: 'Solicitud no válida.' });
    return;
  }

  if (!isSameOrigin(req)) {
    respond(res, 403, { ok: false, error: 'Solicitud no autorizada.' });
    return;
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1000));
    respond(res, 429, {
      ok: false,
      error: 'Demasiadas solicitudes. Intentá nuevamente más tarde.',
    });
    return;
  }

  const payload = validateContactPayload(req.body);
  if (payload?.bot) {
    respond(res, 200, { ok: true });
    return;
  }
  if (!payload) {
    respond(res, 400, { ok: false, error: 'Revisá los datos ingresados.' });
    return;
  }

  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER;
  const recipient = process.env.CONTACT_FORM_TO || DEFAULT_RECIPIENT;
  if (!transporter || !smtpUser) {
    respond(res, 503, { ok: false, error: 'El formulario no está disponible temporalmente.' });
    return;
  }

  const submittedAt = new Date().toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  try {
    await transporter.sendMail({
      from: `"Formulario web · Informática Integral MDQ" <${smtpUser}>`,
      to: recipient,
      replyTo: payload.email ? { name: payload.nombre, address: payload.email } : undefined,
      subject: `Nueva consulta web · ${payload.nombre}`,
      text: [
        'Nueva consulta recibida desde el sitio web.',
        '',
        `Fecha: ${submittedAt}`,
        `Nombre: ${payload.nombre}`,
        `Teléfono: ${payload.telefono || 'No informado'}`,
        `Email: ${payload.email || 'No informado'}`,
        `Servicio: ${payload.servicio}`,
        '',
        'Mensaje:',
        payload.mensaje,
      ].join('\n'),
      html: `
        <h2>Nueva consulta web</h2>
        <p><strong>Fecha:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>Nombre:</strong> ${escapeHtml(payload.nombre)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(payload.telefono || 'No informado')}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email || 'No informado')}</p>
        <p><strong>Servicio:</strong> ${escapeHtml(payload.servicio)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(payload.mensaje).replace(/\n/g, '<br>')}</p>
      `,
    });

    respond(res, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown mail error';
    console.error('Contact email delivery failed:', message);
    respond(res, 502, {
      ok: false,
      error: 'No pudimos entregar la consulta. Intentá nuevamente más tarde.',
    });
  }
}
