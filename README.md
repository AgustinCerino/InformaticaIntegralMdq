# Informática Integral MDQ

Sitio institucional de Informática Integral MDQ: redes corporativas, ciberseguridad, monitoreo, soporte técnico y desarrollos a medida para empresas de Mar del Plata.

## Tecnologías

- Angular 21 con componentes standalone y carga diferida por ruta.
- SSR y prerender de la landing y la política de privacidad.
- Express para ejecución SSR fuera de Vercel.
- Función serverless compatible con Vercel para `POST /api/contact`.
- Nodemailer para la entrega de consultas.
- Vitest y Node Test Runner.

## Requisitos

- Node.js `^20.19.0`, `^22.12.0` o `^24.0.0`.
- npm 11 o compatible.

## Instalación y desarrollo

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

## Variables de entorno

Copiá `.env.example` y configurá las variables en el entorno de despliegue. No subas archivos `.env` al repositorio.

- `SMTP_USER`: cuenta remitente.
- `SMTP_PASS`: App Password o credencial SMTP; nunca la contraseña personal de la cuenta.
- `CONTACT_FORM_TO`: casilla que recibe las consultas. Es opcional y, si no se define, usa `informaticaintegralmdq@gmail.com`.
- `SITE_URL`: URL pública completa, sin barra final. Se usa para generar `sitemap.xml`. En Vercel se utiliza automáticamente `VERCEL_PROJECT_PRODUCTION_URL` cuando está disponible.

## Comandos

```bash
npm run build          # producción, SSR y prerender
npm run test:ci        # pruebas Angular y del servidor
npm run test:server    # validación del endpoint de contacto
npm run format         # formatea el repositorio
npm run format:check   # valida formato sin modificar
npm run audit:prod     # auditoría de dependencias de producción
npm run check          # formato + build + suite completa + auditoría de producción
```

## Estructura

```text
src/app/
  components/          secciones y elementos visuales
  core/contact/        cliente HTTP y contratos del formulario
  core/seo/            título, metadatos y canonical por ruta
  data/                contenido comercial centralizado
  pages/               landing y política de privacidad
src/server/
  contact-handler.mjs  validación, antiabuso y envío de correo compartido
api/
  contact.js           adaptador serverless de Vercel
scripts/
  generate-seo.mjs     sitemap y robots para el dominio de producción
tests/
  contact-handler.test.mjs
```

Los textos de servicios, certificaciones, casos y datos comerciales se editan en `src/app/data/site-content.ts`.

## Formulario y seguridad

El endpoint acepta únicamente JSON por `POST /api/contact` e incluye:

- validación y longitudes máximas en cliente y servidor;
- lista permitida de servicios;
- escape de contenido HTML y validación de cabeceras de correo;
- verificación de origen cuando el navegador envía `Origin`;
- honeypot y tiempo mínimo de completado;
- límite de cinco intentos cada diez minutos por instancia/IP;
- límite de cuerpo de 20 kB, timeouts SMTP y respuestas sin caché;
- cabeceras de seguridad en Express y Vercel.

El rate limit en memoria protege una instancia. Si el sitio escala a múltiples instancias o recibe abuso sostenido, debe reemplazarse por un almacén distribuido compatible con la plataforma.

## Despliegue

### Vercel

1. Importá el repositorio.
2. Configurá `SMTP_USER`, `SMTP_PASS`, `CONTACT_FORM_TO` y `SITE_URL`.
3. Usá el preset Angular y el comando `npm run build`.
4. Verificá que `/api/contact`, `/politica-de-privacidad`, `/robots.txt` y `/sitemap.xml` respondan correctamente.

### Servidor Node

```bash
npm run build
npm run serve:ssr:InformaticaIntegralMdq
```

El servidor utiliza `PORT` o, por defecto, el puerto `4000`.

## Actualización de contenido y activos

- Mantener logos de clientes en SVG o en imágenes de al menos 600 px cuando sea posible.
- Confirmar autorización antes de publicar nombres, resultados o testimonios de clientes.
- Mantener vigentes las certificaciones y sus descripciones.
- Actualizar la política de privacidad si se agregan analítica, cookies o nuevos proveedores.
