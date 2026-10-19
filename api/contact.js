import nodemailer from 'nodemailer';

const TOPICS = ['life', 'tech', 'dev', 'business', 'unsure'];

const LIMITS = {
  name: 100,
  email: 254,
  message: 5000
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  el: {
    subject: 'Νέο μήνυμα από το zengentleman.me',
    name: 'Όνομα',
    email: 'Email',
    topic: 'Θέμα',
    message: 'Μήνυμα',
    topics: {
      life: 'Καθοδήγηση ζωής (Zen)',
      tech: 'Τεχνολογία για ιδιώτες',
      dev: 'Mentoring για προγραμματιστές',
      business: 'Τεχνολογία & συστήματα για επιχειρήσεις',
      unsure: 'Δεν είμαι σίγουρος/η ακόμα'
    }
  },
  en: {
    subject: 'New message from zengentleman.me',
    name: 'Name',
    email: 'Email',
    topic: 'Topic',
    message: 'Message',
    topics: {
      life: 'Life guidance (Zen)',
      tech: 'Technology for individuals',
      dev: 'Mentoring for developers',
      business: 'Technology & systems for businesses',
      unsure: 'Not sure yet'
    }
  }
};

function json(body, status, headers) {
  return Response.json(body, { status, headers });
}

function oneLine(value) {
  return String(value).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function readPort(raw) {
  if (raw == null || String(raw).trim() === '') return 465;
  const port = Number(String(raw).trim());
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return port;
}

function readSecure(raw, port) {
  if (raw == null || String(raw).trim() === '') return port === 465;
  const value = String(raw).trim().toLowerCase();
  if (value === '1' || value === 'true' || value === 'yes' || value === 'on') return true;
  if (value === '0' || value === 'false' || value === 'no' || value === 'off') return false;
  return null;
}

function readConfig(env) {
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter((key) => !String(env[key] || '').trim());
  if (missing.length) {
    console.error('contact: missing configuration', missing.join(', '));
    return { error: 'Email service is not configured' };
  }

  const port = readPort(env.SMTP_PORT);
  const secure = port == null ? null : readSecure(env.SMTP_SECURE, port);
  if (port == null || secure == null) {
    console.error('contact: invalid SMTP_PORT or SMTP_SECURE');
    return { error: 'Email service is not configured' };
  }

  const user = String(env.SMTP_USER).trim();
  return {
    host: String(env.SMTP_HOST).trim(),
    port,
    secure,
    user,
    pass: String(env.SMTP_PASS).trim(),
    to: String(env.CONTACT_TO || '').trim() || user,
    from: String(env.CONTACT_FROM || '').trim() || user
  };
}

export function parseContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request' };
  }

  const honeypot = body.website;
  if (honeypot != null && (typeof honeypot !== 'string' || honeypot.trim() !== '')) {
    return { error: 'Invalid request', honeypot: true };
  }

  const name = oneLine(body.name ?? '');
  const email = oneLine(body.email ?? '').toLowerCase();
  const topicRaw = body.topic != null ? body.topic : body.subject;
  const topic = typeof topicRaw === 'string' ? topicRaw.trim() : '';
  const message = String(body.message ?? '').replace(/\r\n/g, '\n').trim();
  const lang = String(body.lang ?? '').trim().toLowerCase() === 'en' ? 'en' : 'el';

  if (!name || !email || !topic || !message) {
    return { error: 'Name, email, topic, and message are required' };
  }
  if (name.length > LIMITS.name) return { error: 'Name is too long' };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address' };
  }
  if (!TOPICS.includes(topic)) return { error: 'Please choose a topic' };
  if (message.length > LIMITS.message) return { error: 'Message is too long' };

  return { value: { name, email, topic, message, lang } };
}

function buildMail(value, config) {
  const copy = COPY[value.lang];
  const topicLabel = copy.topics[value.topic];
  const text = [
    `${copy.name}: ${value.name}`,
    `${copy.email}: ${value.email}`,
    `${copy.topic}: ${topicLabel}`,
    '',
    `${copy.message}:`,
    value.message
  ].join('\n');

  return {
    from: config.from,
    to: config.to,
    replyTo: { name: value.name, address: value.email },
    subject: oneLine(`${copy.subject} · ${topicLabel}`),
    text
  };
}

export async function handleContact(request, options = {}) {
  const env = options.env || process.env;
  const createTransport = options.createTransport || nodemailer.createTransport;

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ ok: false, error: 'Expected a JSON body' }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Expected a JSON body' }, 400);
  }

  const parsed = parseContact(body);
  if (parsed.error) {
    if (parsed.honeypot) console.error('contact: rejected honeypot');
    return json({ ok: false, error: parsed.error }, 400);
  }

  const config = readConfig(env);
  if (config.error) return json({ ok: false, error: config.error }, 500);

  try {
    const transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true
    });
    await transporter.sendMail(buildMail(parsed.value, config));
  } catch (err) {
    console.error('contact: send failed', err && err.code, err && err.responseCode);
    return json({ ok: false, error: 'Could not send your message' }, 500);
  }

  return json({ ok: true }, 200);
}

export default {
  async fetch(request) {
    return handleContact(request);
  }
};
