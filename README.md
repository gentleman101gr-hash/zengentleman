# zengentleman

Static website for [zengentleman.me](https://zengentleman.me): Zen and technology guidance by Christos Tsekouras.

The site is bilingual. Greek is the default language; English is available from the EL / EN switch or by opening `?lang=en`.

## Files

The page is static. There is no site build step. Vercel installs `nodemailer` from `package.json` for the contact function; you do not need a local install to read the page.

| File | Role |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Layout and visual design |
| `script.js` | Language switching, navigation, and the contact form |
| `api/contact.js` | Vercel Function that sends the contact form over SMTP |
| `package.json` | Declares the `nodemailer` dependency |
| `vercel.json` | Serves the site with no framework build |

To view it locally, open `index.html` in a browser, or serve the repository root with any static file server:

```sh
python3 -m http.server
```

Then visit `http://localhost:8000/`. A static server does not run `/api/contact`, so submitting the form falls back to your email app. On Vercel, the form sends mail through the function below.

## Contact form

With JavaScript, the form `POST`s JSON to `/api/contact`. That Vercel Function sends the message with SMTP and sets Reply-To to the visitor’s address. If the request fails, the page opens the same `mailto:` link used when JavaScript is off. The form’s `action` stays `mailto:me@zengentleman.com`, so the no-JS path is unchanged.

A hidden honeypot field (`website`) is included. If it is filled in, the function does not send mail.

Set these environment variables in the Vercel project (Settings → Environment Variables). Do not commit them.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SMTP_HOST` | yes | SMTP server hostname |
| `SMTP_PORT` | no | Port. Default `465` |
| `SMTP_SECURE` | no | `true` or `false`. Default `true` when the port is 465, otherwise `false` |
| `SMTP_USER` | yes | SMTP username |
| `SMTP_PASS` | yes | SMTP password or app password |
| `CONTACT_TO` | no | Inbox that receives messages. Defaults to `SMTP_USER` |
| `CONTACT_FROM` | no | From address. Defaults to `SMTP_USER` |

### Gmail

Use an [App Password](https://support.google.com/accounts/answer/185833) (Google Account → Security → 2-Step Verification → App passwords). The normal account password will not work, and the From address should be that Gmail account.

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_TO=me@zengentleman.com
CONTACT_FROM=you@gmail.com
```

### Another provider

Port 465 is implicit TLS (`SMTP_SECURE=true`). Port 587 is usually STARTTLS (`SMTP_SECURE=false`).

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mailer@example.com
SMTP_PASS=your-smtp-password
CONTACT_TO=me@zengentleman.com
CONTACT_FROM=mailer@example.com
```

## Preview

Desktop and mobile screenshots of the Greek and English versions:

| Greek | English |
| --- | --- |
| ![Desktop, Greek](docs-preview/preview-desktop.png) | ![Desktop, English](docs-preview/preview-desktop-en.png) |
| ![Mobile, Greek](docs-preview/preview-mobile.png) | ![Mobile, English](docs-preview/preview-mobile-en.png) |

## Domain

The intended public domain is `zengentleman.me`. A GitHub Pages `CNAME` file is not included yet, because DNS for that domain is not set up.
