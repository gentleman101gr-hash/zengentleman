/* zengentleman: bilingual (EL / EN) without a build step.
   Greek lives in the HTML, so the page reads fine with JS disabled.
   On load the Greek strings are captured from the DOM; English comes from the object below. */
(function () {
  'use strict';

  const SUPPORTED = ['el', 'en'];
  const STORAGE_KEY = 'zg-lang';

  const T = {
    el: {
      // Strings that exist only in JS (not in the HTML)
      'a11y.menuOpen': 'Άνοιγμα μενού',
      'a11y.menuClose': 'Κλείσιμο μενού',
      'form.sending': 'Στέλνεται…',
      'form.success': 'Το μήνυμα στάλθηκε. Θα επικοινωνήσω μαζί σου σύντομα.',
      'form.error': 'Δεν στάλθηκε. Ανοίγει το πρόγραμμα email σου.',
      'form.noteLive': 'Το μήνυμα στέλνεται από εδώ. Αν δεν τα καταφέρει, ανοίγει το email σου.',
      'mail.subject': 'Νέο μήνυμα από το zengentleman.me',
      'mail.name': 'Όνομα',
      'mail.email': 'Email',
      'mail.topic': 'Θέμα',
      'mail.message': 'Μήνυμα',
      'meta.locale': 'el_GR',
      'meta.localeAlt': 'en_US'
    },
    en: {
      'meta.title': 'zengentleman · Zen & Technology · Guidance',
      'meta.desc': 'Life guidance through the lens of Zen, and technology guidance for individuals, developers and businesses.',
      'meta.locale': 'en_US',
      'meta.localeAlt': 'el_GR',

      'a11y.skip': 'Skip to content',
      'a11y.home': 'zengentleman, home',
      'a11y.nav': 'Main navigation',
      'a11y.lang': 'Language',
      'a11y.menuOpen': 'Open menu',
      'a11y.menuClose': 'Close menu',

      'nav.philosophy': 'Philosophy',
      'nav.services': 'Services',
      'nav.process': 'How it works',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',

      'hero.eyebrow': 'Zen master · Tech freak · Christos Tsekouras',
      'hero.tagline': 'Clear mind, clear systems.',
      'hero.lead': 'Guidance for life and for technology, with the calm of Zen and the precision of an engineer. For people, developers and businesses who want to see more clearly.',
      'hero.cta': 'Book a session',
      'hero.cta2': 'Explore services',

      'phil.eyebrow': 'Philosophy',
      'phil.title': 'Zen and code speak the same language',
      'phil.p1': 'Zen teaches presence, simplicity and accepting what is truly here. Good technology is built on the same principles: less noise, clear intention, and systems that serve people, not the other way around.',
      'phil.p2': 'I’m Christos Tsekouras, a Zen master and a tech freak. I work where these two worlds meet. Whether you’re looking for direction in life, trying to make sense of technology, or your team needs clearer systems, the approach is the same: we pause, look clearly, and take the next right step.',
      'phil.k1': 'Simplicity',
      'phil.k1d': 'We let go of what’s unnecessary until the essential shows itself.',
      'phil.k2': 'Presence',
      'phil.k2d': 'Full attention to the problem and to the person in front of me.',
      'phil.k3': 'Practice',
      'phil.k3d': 'Understanding becomes action, one step at a time.',

      'svc.eyebrow': 'Services',
      'svc.title': 'Four paths, one approach',
      'svc.1t': 'Life guidance through Zen',
      'svc.1d': 'For times of confusion, change, or simply searching. Tools from Zen practice for more calm, more clarity and more meaningful decisions.',
      'svc.2t': 'Technology for everyone',
      'svc.2d': 'Guidance for individuals who want to understand and use technology with confidence: devices, tools, digital safety, and a healthier relationship with screens.',
      'svc.3t': 'Mentoring for developers',
      'svc.3d': 'For developers at every stage: technical decisions, architecture, good practices, career growth, and how to work with focus without burning out.',
      'svc.4t': 'Technology & systems for businesses',
      'svc.4d': 'Guidance for businesses that need clear technology direction: choosing the right tools, organising systems and processes, and digital transformation at a sensible pace.',

      'proc.eyebrow': 'How it works',
      'proc.title': 'Three simple steps',
      'proc.1t': 'Getting to know each other',
      'proc.1d': 'A first conversation so I can hear where you are, what you need, and whether we’re a good fit. This first meeting is free.',
      'proc.2t': 'A plan',
      'proc.2d': 'Together we clarify the goal and shape a simple, realistic plan tailored to you or your team.',
      'proc.3t': 'Guidance',
      'proc.3d': 'Guidance sessions at a pace that suits you, online from anywhere in the world, with steady progress and room to reflect.',

      'price.per': 'per 30 minutes',
      'price.title': 'Pay when it’s worth it',
      'price.text': 'Sessions are free until you feel you’re getting real value. From that moment on, you pay for all the time from the very beginning, previous sessions included. No pressure, just trust.',

      'aud.eyebrow': 'Who it’s for',
      'aud.title': 'Who I work with',
      'aud.1t': 'Individuals',
      'aud.1d': 'People looking for calm and direction in their lives, or who want to feel at ease with everyday technology.',
      'aud.2t': 'Developers',
      'aud.2d': 'Developers who want to grow technically and professionally, make better decisions and work with more focus.',
      'aud.3t': 'Businesses',
      'aud.3d': 'Teams and businesses that need an advisor to bring order to their systems and technology.',

      'faq.eyebrow': 'Questions',
      'faq.title': 'Frequently asked questions',
      'faq.1q': 'Do I need any experience with Zen or meditation?',
      'faq.1a': 'Not at all. We start from wherever you are. Zen here is a way of seeing clearly, not something you need to know beforehand.',
      'faq.2q': 'Are sessions online or in person?',
      'faq.2a': 'All sessions are online, so we can work together from anywhere in the world. All you need is a connection and a little quiet time.',
      'faq.3q': 'Can I combine life guidance and technology guidance?',
      'faq.3a': 'Yes. The two are often connected, for example our relationship with screens, or the pressure of a developer’s work. The plan adapts to whatever you need.',
      'faq.4q': 'How much does a session cost?',
      'faq.4a': '5€ (or 5$) per half hour, with a slightly different approach: our sessions are free until the moment you feel you’re getting real value. From then on, you pay for all the time we’ve spent together from the very beginning, previous sessions included, at 5€/5$ per 30 minutes. If it doesn’t help you, you owe nothing.',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Book a session',
      'contact.text': 'Write me a few words about what you’re looking for, and I’ll get back to you to arrange a first conversation.',
      'contact.areaLabel': 'Location',
      'contact.area': 'Worldwide, online',

      'form.name': 'Name',
      'form.namePh': 'Your name',
      'form.topic': 'I’m interested in',
      'form.opt1': 'Life guidance (Zen)',
      'form.opt2': 'Technology for individuals',
      'form.opt3': 'Mentoring for developers',
      'form.opt4': 'Technology & systems for businesses',
      'form.opt5': 'Not sure yet',
      'form.message': 'Message',
      'form.messagePh': 'What are you looking for? How can I help?',
      'form.submit': 'Send',
      'form.sending': 'Sending…',
      'form.success': 'Your message was sent. I’ll get back to you soon.',
      'form.error': 'It couldn’t be sent. Your email app is opening.',
      'form.note': 'The form opens your email app.',
      'form.noteLive': 'Your message is sent from here. If that doesn’t work, your email app opens.',

      'footer.quote': '“One step at a time. One line of code at a time.”',
      'footer.name': 'Christos Tsekouras',

      'mail.subject': 'New message from zengentleman.me',
      'mail.name': 'Name',
      'mail.email': 'Email',
      'mail.topic': 'Topic',
      'mail.message': 'Message'
    }
  };

  // Capture the Greek originals from the DOM so they are defined once, in the HTML.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!(k in T.el)) T.el[k] = el.textContent.trim();
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, k] = pair.split(':').map(s => s.trim());
      if (!(k in T.el)) T.el[k] = el.getAttribute(attr) || '';
    });
  });

  let current = 'el';
  const t = key => (T[current] && T[current][key]) ?? T.el[key] ?? key;

  function readStored() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function store(lang) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ } }

  function detectLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && SUPPORTED.includes(fromUrl.toLowerCase())) return fromUrl.toLowerCase();
    const saved = readStored();
    if (saved && SUPPORTED.includes(saved)) return saved;
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'el'];
    return langs.some(l => String(l).toLowerCase().startsWith('el')) ? 'el' : 'en';
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  function applyLang(lang) {
    current = SUPPORTED.includes(lang) ? lang : 'el';
    document.documentElement.lang = current;

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, k] = pair.split(':').map(s => s.trim());
        el.setAttribute(attr, t(k));
      });
    });

    document.querySelectorAll('.lang-btn').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === current));
    });

    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));

    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (submitBtn && sending) submitBtn.textContent = t('form.sending');
    const statusEl = document.getElementById('form-status');
    if (statusEl && formStatusKey) statusEl.textContent = t(formStatusKey);
  }

  function setLang(lang) {
    applyLang(lang);
    store(current);
    // Keep an explicit ?lang= in the URL in sync, so shared links match what is on screen.
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', current);
      history.replaceState(null, '', url);
    }
  }

  // Language switch (progressive enhancement: hidden without JS)
  const sw = document.querySelector('.lang-switch');
  sw.hidden = false;
  sw.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  // Mobile nav toggle
  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
    nav.classList.toggle('open', open);
  }
  navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); navToggle.focus(); }
  });

  // Contact form: POST to the Vercel function. Mailto stays the no-JS action and the failure fallback.
  const form = document.getElementById('contact-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('form-status');
  let sending = false;
  let formStatusKey = '';

  const note = form.querySelector('.form-note');
  note.dataset.i18n = 'form.noteLive';

  function setFormStatus(key, kind) {
    formStatusKey = key || '';
    if (!formStatusKey) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      statusEl.classList.remove('is-success', 'is-error');
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = t(formStatusKey);
    statusEl.classList.toggle('is-success', kind === 'success');
    statusEl.classList.toggle('is-error', kind === 'error');
  }

  function openMailto() {
    const topic = form.topic.options[form.topic.selectedIndex].text;
    const body = [
      `${t('mail.name')}: ${form.name.value.trim()}`,
      `${t('mail.email')}: ${form.email.value.trim()}`,
      `${t('mail.topic')}: ${topic}`,
      '',
      `${t('mail.message')}:`,
      form.message.value.trim()
    ].join('\n');
    const subject = `${t('mail.subject')} · ${topic}`;
    location.href = 'mailto:me@zengentleman.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', async (e) => {
    if (!form.checkValidity()) return;
    e.preventDefault();
    if (sending) return;

    sending = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.textContent = t('form.sending');
    setFormStatus('', '');

    let sent = false;
    try {
      const honeypot = form.elements.website;
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        topic: form.topic.value,
        message: form.message.value.trim(),
        lang: current,
        website: honeypot ? honeypot.value : ''
      };
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data = null;
      try { data = await res.json(); } catch (err) { data = null; }
      sent = res.ok && data && data.ok === true;
    } catch (err) {
      sent = false;
    } finally {
      sending = false;
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      submitBtn.textContent = t('form.submit');
    }

    if (sent) {
      setFormStatus('form.success', 'success');
      form.reset();
    } else {
      setFormStatus('form.error', 'error');
      openMailto();
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  applyLang(detectLang());
})();
