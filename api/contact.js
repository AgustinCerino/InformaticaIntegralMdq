const nodemailer = require('nodemailer');

const CONTACT_DEFAULT_TO = 'informaticaintegralmdq@gmail.com';

function toTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactRecipient = process.env.CONTACT_FORM_TO || CONTACT_DEFAULT_TO;

  if (!smtpUser || !smtpPass) {
    res.status(503).json({
      ok: false,
      error: 'El servicio de correo no esta configurado en el servidor.',
    });
    return;
  }

  const body = req.body || {};

  const nombre = toTrimmedText(body.nombre);
  const telefono = toTrimmedText(body.telefono);
  const email = toTrimmedText(body.email);
  const servicio = toTrimmedText(body.servicio) || 'Diagnostico general';
  const mensaje = toTrimmedText(body.mensaje);

  if (nombre.length < 2 || telefono.length < 6 || !email.includes('@') || mensaje.length < 12) {
    res.status(400).json({ ok: false, error: 'Datos de contacto invalidos.' });
    return;
  }

  const submittedAt = new Date().toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
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
};
