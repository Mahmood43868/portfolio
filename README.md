# Portfolio

A portfolio site for a full-stack software engineer. Next.js 16 · React 19 · TypeScript ·
Tailwind CSS v4, with a working contact form and an AI assistant that answers recruiter
questions from your resume.

```bash
npm install
npm run dev          # http://localhost:3000
```

It runs immediately — **no API keys required**. Each key you add turns on one more feature.

---

## Make it yours

### 1. Edit one file

Everything on the page — name, projects, skills, jobs, education, SEO — lives in
[`src/content/profile.ts`](src/content/profile.ts). Nothing else needs touching.

Search that file for `TODO` and work through the list:

| What | Where |
| --- | --- |
| Name, initials, location, phone | top of the file |
| GitHub + LinkedIn URLs | `socials` |
| Stats under the hero | `stats` |
| Skills and 1–5 levels | `skills` |
| Projects (set `featured: true` for the big cards) | `projects` |
| Internships / freelance / open source | `experience` |
| Degree, university, CGPA | `education` |
| Certifications | `certifications` |
| Your real domain | `seo.siteUrl` |

The placeholder content is written the way good resume content reads — every bullet leads with
what *changed*, and every project carries a measured number. Keep that shape when you swap in
your own.

### 2. Add your resume PDF

Drop it at `public/resume.pdf`. The nav button and mobile menu already point there.

### 3. Write project bullets that land

The single biggest upgrade you can make. Compare:

> ~~Worked on the backend using Node.js and MongoDB.~~
>
> Cut the dashboard's initial load from 3.1s to 600ms by replacing four sequential queries
> with a single aggregation.

If you don't have numbers yet, measure something — request time before and after, bundle size,
test count, rows processed. A real number from a small project beats a vague claim about a big one.

---

## Optional keys

Copy `.env.example` to `.env.local` and fill in what you want. `.env.local` is gitignored, so
your keys never get committed.

### Contact form — [Resend](https://resend.com)

Free tier covers 3,000 emails/month.

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=you@gmail.com
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

**Without the key** the form still validates and returns success, logging the message to your
terminal — so you can demo it before signing up.

To send from your own domain, verify it in the Resend dashboard first, then change
`CONTACT_FROM_EMAIL`. Until you do, `onboarding@resend.dev` works for testing.

The form is protected by a hidden honeypot field and a 5-per-hour-per-IP rate limit.

### AI chat widget — [Anthropic](https://console.anthropic.com)

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

**Without the key** the widget shows a clear "not configured yet" message and points visitors at
the contact form.

The assistant's knowledge is generated from `profile.ts` by `buildResumeContext()`, so it can
never contradict the page. It's instructed to answer only from that context, to say plainly when
something isn't covered, and to decline off-topic questions.

**Cost.** The default model is `claude-opus-5`. For a public site you may prefer something
cheaper — change one line in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts):

```ts
const MODEL = "claude-haiku-4-5";
```

The prompt works unchanged on either. There's also a 12-questions-per-hour-per-IP limit, and the
system prompt is cached, so repeat visitors cost a fraction of the first.

> If your account isn't enrolled in the server-side fallback beta, the chat route may return a
> 400. Delete the `betas` and `fallbacks` lines in that same file — they only exist to retry
> automatically if a safety classifier ever declines a question.

---

## Deploy

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Paste your env vars into **Project Settings → Environment Variables**
4. Deploy

Then set `seo.siteUrl` in `profile.ts` to your live domain and redeploy — it drives the sitemap,
canonical URL, and link previews.

---

## What's included

- **Dark / light / system theme** — no flash on load, respects the OS setting
- **SEO** — per-page metadata, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema
- **Link previews** — an Open Graph card generated from your profile at
  [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx), no image to maintain
- **Accessibility** — skip link, visible focus rings, labelled fields, `aria-live` regions,
  keyboard-navigable chat, full `prefers-reduced-motion` support
- **Print stylesheet** — Ctrl+P produces a usable one-pager
- **Rate limiting** on both API routes, HTML-escaped email output, honeypot spam trap

## Structure

```
src/
├─ content/profile.ts       ← all your content + the chatbot's context
├─ app/
│  ├─ layout.tsx            fonts, metadata, JSON-LD
│  ├─ page.tsx              section composition
│  ├─ globals.css           design tokens, light/dark palettes
│  ├─ opengraph-image.tsx   generated link-preview card
│  └─ api/{chat,contact}/   route handlers
├─ components/              one file per section + chat widget
└─ lib/                     shared zod schema, rate limiter
```

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build (runs the content check first)
npm start        # serve the build
npm run lint     # eslint
npm run check    # list any placeholder content still in profile.ts
npm run smoke    # browser smoke test against a running dev server
```

### Smoke test

`npm run smoke` drives a real browser against `localhost:3000` and asserts the things that are
easy to break and easy not to notice — 26 checks covering every section rendering, heading and
landmark structure, the theme toggle (switches both ways and persists across reload), the chat
panel opening and closing on Escape, the mobile menu, horizontal overflow at 375px, and zero
console errors.

```bash
npm run dev      # terminal 1
npm run smoke    # terminal 2
```

It uses whichever Chromium browser you already have (Edge or Chrome) — nothing to download.
Point it elsewhere with `SMOKE_URL=https://your-domain.com npm run smoke` to check production
after a deploy.

### The content check

`npm run build` runs [`scripts/check-content.mjs`](scripts/check-content.mjs) first, which scans
`profile.ts` for leftover placeholders — `your-username` links, `your-domain.com`, the invented
project names, and any `// TODO` markers — and prints them.

It **warns without failing**, so it never blocks a build. The point is that the list shows up in
your Vercel deploy log, where you'll see it before a recruiter clicks a dead project link.

Run `npm run check` any time to see what's left.
