import assert from 'node:assert/strict';
import test from 'node:test';
import { handleContactRequest, validateContactPayload } from '../src/server/contact-handler.mjs';

const validPayload = {
  nombre: 'Empresa de prueba',
  telefono: '+54 223 555 0000',
  email: 'consulta@example.com',
  servicio: 'Ciberseguridad',
  mensaje: 'Necesitamos revisar la seguridad actual de la red.',
  website: '',
  startedAt: Date.now() - 5_000,
};

function responseMock() {
  return {
    statusCode: 200,
    headers: new Map(),
    body: undefined,
    ended: false,
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), String(value));
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

function requestMock(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'localhost:4200',
      origin: 'http://localhost:4200',
    },
    ip: `127.0.0.${Math.floor(Math.random() * 200) + 1}`,
    socket: { encrypted: false, remoteAddress: '127.0.0.1' },
    body: {},
    ...overrides,
  };
}

test('rejects methods other than POST and OPTIONS', async () => {
  const req = requestMock({ method: 'GET' });
  const res = responseMock();
  await handleContactRequest(req, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.get('allow'), 'POST, OPTIONS');
});

test('rejects malformed contact data before invoking SMTP', async () => {
  const req = requestMock({ body: { nombre: 'A' } });
  const res = responseMock();
  await handleContactRequest(req, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { ok: false, error: 'Revisá los datos ingresados.' });
});

test('accepts either phone or email and validates any provided contact channel', () => {
  assert.ok(validateContactPayload({ ...validPayload, email: '' }));
  assert.ok(validateContactPayload({ ...validPayload, telefono: '' }));
  assert.equal(validateContactPayload({ ...validPayload, telefono: '', email: '' }), null);
  assert.equal(
    validateContactPayload({ ...validPayload, telefono: 'teléfono inválido', email: '' }),
    null,
  );
  assert.equal(
    validateContactPayload({ ...validPayload, telefono: '', email: 'correo-inválido' }),
    null,
  );
  assert.equal(
    validateContactPayload({ ...validPayload, telefono: '123', email: 'consulta@example.com' }),
    null,
  );
});

test('silently accepts honeypot submissions', async () => {
  const req = requestMock({
    body: {
      nombre: 'Bot de prueba',
      telefono: '2235550000',
      email: 'bot@example.com',
      servicio: 'Otro',
      mensaje: 'Este mensaje tiene longitud suficiente.',
      website: 'https://spam.example',
      startedAt: Date.now() - 5_000,
    },
  });
  const res = responseMock();
  await handleContactRequest(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
});

test('rejects requests from a different origin', async () => {
  const req = requestMock({
    headers: {
      'content-type': 'application/json',
      host: 'localhost:4200',
      origin: 'https://malicious.example',
    },
  });
  const res = responseMock();
  await handleContactRequest(req, res);
  assert.equal(res.statusCode, 403);
});
