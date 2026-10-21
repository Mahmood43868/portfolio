/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT.
 *  Every section of the site reads from here, including the
 *  AI chat widget's knowledge of you.
 *  Replace everything marked TODO with your real details.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  // ── Identity ──────────────────────────────────────────────
  name: "Mahmood Ul Hassan",
  initials: "MH", // shown in the nav mark and the OG card
  role: "Full-Stack Software Engineer",
  tagline:
    "Computer Science graduate who ships end-to-end — from schema design to the pixel that finally lines up.",
  location: "Lahore, Pakistan",
  email: "mhassan43868@gmail.com",
  // Deliberately empty: a mobile number on a public page gets scraped by spam
  // callers. It lives in the resume PDF instead, where only people you send it
  // to can see it. Put a number back here if you'd rather take calls directly.
  phone: "",
  availability: "Open to full-time roles · Available immediately",

  socials: {
    github: "https://github.com/mahmood43868",
    linkedin: "https://www.linkedin.com/in/mahmood-hassan43868",
    // Drop your PDF at public/resume.pdf and this just works
    resume: "/resume.pdf",
  },

  // ── About ─────────────────────────────────────────────────
  about: [
    "I finished my Computer Science degree wanting one thing: to build software people actually open. Most of what I know came from shipping — reading production stack traces, rewriting a query that took eight seconds, and learning why the second version of a feature is always simpler than the first.",
    "I work across the stack. On the backend I like clean data models, honest error handling, and APIs that are boring to consume. On the frontend I care about the details that make an interface feel fast — optimistic updates, skeletons that match the real layout, and keyboard paths that work.",
    "Right now I'm looking for a team that reviews code carefully and lets juniors own real surface area.",
  ],

  // Small proof-points under the hero. Keep to 3–4.
  // Every one of these must be literally true — a recruiter who catches one
  // inflated number stops trusting the whole page.
  stats: [
    { value: "Shopify", label: "Custom themes shipped in production" },
    { value: "3 mo", label: "Remote professional experience" },
    { value: "2026", label: "BS Computer Science, UMT" },
    // TODO — if your CGPA is 3.0 or above it's worth adding as a fourth stat:
    //   { value: "3.5", label: "CGPA / 4.0" }
    // Below 3.0, leave it off the site entirely and let the work speak.
  ],

  // ── Skills ────────────────────────────────────────────────
  // `level` is 1–5 and drives the meter width.
  //   5 — shipped and debugged it in production
  //   4 — comfortable, used it in real work
  //   3 — productive, still reaching for docs
  //   2 — actively learning
  //
  // Everything at 3 or above below is backed by the Muscled Hub role or by
  // code in your GitHub. An interviewer WILL probe a 5, so the honest 3 is
  // the stronger answer — it earns you the follow-up instead of exposing you.
  //
  // TODO — go through this list and correct it. Delete anything you couldn't
  // discuss for two minutes; add anything real that I've missed.
  skills: [
    {
      group: "Shopify & E-commerce",
      items: [
        { name: "Shopify Liquid", level: 4 },
        { name: "Custom theme development", level: 4 },
        { name: "Storefront sections & blocks", level: 3 },
        { name: "Shopify CLI", level: 3 },
      ],
    },
    {
      group: "Frontend",
      items: [
        { name: "JavaScript", level: 4 },
        { name: "HTML & semantic markup", level: 4 },
        { name: "CSS & responsive layout", level: 4 },
        { name: "EJS templating", level: 3 },
        { name: "React", level: 2 },
      ],
    },
    {
      group: "Backend & Databases",
      items: [
        { name: "Node.js", level: 3 },
        { name: "Express", level: 3 },
        { name: "MongoDB & Mongoose", level: 3 },
        { name: "Auth — JWT & bcrypt", level: 3 },
        { name: "REST routing & middleware", level: 3 },
        { name: "SQL & PostgreSQL", level: 3 },
      ],
    },
    {
      group: "Languages & Tools",
      items: [
        { name: "Python", level: 3 },
        { name: "C++", level: 2 },
        { name: "Git & GitHub", level: 4 },
        { name: "Chrome DevTools", level: 3 },
        { name: "Remote / async collaboration", level: 4 },
      ],
    },
  ],

  // ── Projects ──────────────────────────────────────────────
  // `featured: true` gives the project a wide card at the top.
  // `metrics` are the single most persuasive thing on this page — use real numbers.
  projects: [
    {
      title: "Bilal Glass Inventory",
      year: "2026",
      featured: true,
      status: "In development · Private source",
      blurb: "Inventory and production management for a car-mirror business.",
      description:
        "A business application connecting raw-glass imports, cutting and production, reusable leftover material, finished mirrors, sales, invoices and customer payments. Built with React and TypeScript, a Django REST API, and PostgreSQL. Core workflows are implemented; final release work is ongoing.",
      highlights: [
        "Tracks raw glass, reusable leftovers and finished mirrors as separate inventory stages.",
        "Coordinates sales, invoices, payments and customer balances through backend service logic.",
        "Uses database transactions, row locking and idempotency handling for stock and financial operations.",
        "Includes automated tests for business workflows, permissions and concurrent inventory changes.",
      ],
      metrics: [
        { value: "3 stages", label: "raw glass, reusable leftovers and finished mirrors" },
        { value: "PostgreSQL", label: "transactions and inventory integrity" },
      ],
      tags: ["React", "TypeScript", "Python", "Django REST Framework", "PostgreSQL", "Docker"],
      github: "",
      demo: "",
    },
    {
      title: "Insights Academy",
      year: "2026",
      featured: true,
      status: "Academy management system",
      blurb: "Student enrollment, fees, test reports and a parent portal in one application.",
      description:
        "A full-stack academy management system built with React, Express and MongoDB. Administrators manage students, enrollments, fees and academic reports, while guardians have a read-only portal for their own children's records.",
      highlights: [
        "Coordinates student enrollment, linked guardian accounts and payments using MongoDB transactions.",
        "Supports fee invoices, payment history, outstanding balances and printable payment receipts.",
        "Enforces administrator, staff, sub-admin and parent access rules on the server.",
        "Includes test-report workflows, database backup and restore tools, and automated frontend and API tests.",
      ],
      metrics: [
        { value: "Parent portal", label: "access limited to linked children's records" },
        { value: "MongoDB", label: "transactions for multi-record workflows" },
      ],
      tags: ["React", "JavaScript", "Express", "MongoDB", "Mongoose", "JWT", "Tailwind CSS"],
      github: "https://github.com/insightsacademyedu-afk/Insights-Academy",
      demo: "",
    },
    {
      // ── REAL PROJECT ──────────────────────────────────────
      title: "Blogify",
      year: "2026",
      featured: false,
      status: "Public repository",
      blurb: "A full-stack blogging platform with accounts, authoring and image uploads.",
      description:
        "A server-rendered blogging site where visitors register, sign in, and publish posts with cover images. Express handles routing, EJS renders the views, and MongoDB stores users and posts through Mongoose. Sessions are JWTs held in cookies, and passwords are hashed with bcrypt rather than stored anywhere in the clear.",
      highlights: [
        "Cookie-based JWT authentication with bcrypt-hashed passwords, enforced in dedicated middleware instead of repeated checks inside each route.",
        "Full create/read/update/delete for posts, with Multer handling cover-image uploads.",
        "Laid out as a conventional MVC application — separate controller, model, routes, middleware and utils directories — rather than one oversized entry file.",
        "Documented with a README covering environment variables, local setup, and step-by-step deployment to Railway with a provisioned MongoDB instance.",
      ],
      metrics: [
        { value: "JWT", label: "cookie sessions, bcrypt-hashed passwords" },
        { value: "MVC", label: "controllers, models, routes, middleware" },
      ],
      tags: ["Node.js", "Express", "MongoDB", "Mongoose", "EJS", "JWT", "Multer", "Railway"],
      github: "https://github.com/mahmood43868/Blog-Post",
      demo: "",
    },
    {
      title: "Order Automation",
      year: "2026",
      featured: false,
      status: "University final-year project · Private source",
      blurb: "An AI-assisted ordering and delivery platform — my university FYP.",
      description:
        "A university final-year project connecting WhatsApp order intake, inventory reservations, a live business dashboard and driver deliveries. A LangGraph agent powered by Gemini handles English and Roman Urdu conversations, while a Capacitor driver app supports queued offline actions.",
      highlights: [
        "A conversational ordering agent searches the product catalog, reserves stock and supports human escalation.",
        "A Next.js organization dashboard provides Kanban order tracking, driver assignment and agent logs.",
        "A mobile driver app combines realtime updates with an offline action queue.",
        "A Turborepo monorepo shares UI components, database types and utilities across the web and driver apps.",
      ],
      metrics: [
        { value: "FYP", label: "university final-year project" },
        { value: "2 apps", label: "business dashboard and driver delivery app" },
      ],
      tags: ["Next.js", "TypeScript", "LangGraph", "Gemini", "Supabase", "PostgreSQL", "Capacitor", "Turborepo"],
      github: "",
      demo: "",
    },
  ],

  // ── Experience ────────────────────────────────────────────
  // Internships, freelance, and open-source all count. Lead each
  // bullet with what changed, not what you were "responsible for".
  /**
   * These bullets are true as written, but they're descriptions of the role
   * rather than evidence of impact — which is the difference between a resume
   * a recruiter skims and one they call about.
   *
   * TODO — replace each with something only you can say. Think back to the job:
   *   · What did a store owner ask for that the stock theme couldn't do?
   *   · Did a page get faster, or a layout stop breaking on mobile?
   *   · How many products/collections/templates did you touch?
   *   · Did conversion, bounce rate, or Lighthouse score move at all?
   * Even "cut homepage load from 4s to 2s by lazy-loading the hero carousel"
   * is worth more than all three of the bullets below combined.
   */
  experience: [
    {
      role: "Shopify Custom Theme Developer",
      org: "Muscled Hub",
      period: "Feb 2026 — Apr 2026",
      location: "Remote",
      points: [
        "Built and customised Shopify themes in Liquid, extending stock templates to match the store's design requirements.",
        "Implemented responsive storefront sections and interactive components with JavaScript, HTML and CSS.",
        "Worked asynchronously with a remote team, shipping theme changes directly against a live storefront.",
      ],
      tech: ["Shopify", "Liquid", "JavaScript", "HTML", "CSS"],
    },
  ],

  education: [
    {
      degree: "BS Computer Science",
      school: "University of Management and Technology (UMT), Lahore",
      period: "2022 — 2026",
      details:
        "Coursework across Data Structures & Algorithms, Database Systems, Operating Systems, Computer Networks and Software Engineering.",
      // TODO — set to e.g. "CGPA 3.5 / 4.0". Empty hides the badge entirely.
      highlight: "",
    },
    {
      degree: "ICS — Intermediate in Computer Science",
      school: "Punjab Group of Colleges (PGC), Lahore",
      period: "2018 — 2020",
      details: "Pre-engineering track with Physics, Mathematics and Computer Science.",
      highlight: "Physics",
    },
  ],

  // TODO — empty for now. Certifications are the fastest credibility win
  // available to you: freeCodeCamp (free), Meta Front-End on Coursera, or
  // Shopify's own Partner Academy theme-development track, which would back
  // up the Muscled Hub role directly. Add them here as you finish them:
  //   { name: "…", issuer: "…", year: "…" }
  certifications: [] as { name: string; issuer: string; year: string }[],

  // ── SEO ───────────────────────────────────────────────────
  seo: {
    // Set this to your real domain before deploying — it drives
    // canonical URLs, sitemap, and Open Graph image resolution.
    siteUrl: "https://mahmood-hassan-portfolio.vercel.app",
    description:
      "Portfolio of a full-stack software engineer — projects, experience, and an AI assistant that answers questions about my background.",
    keywords: [
      "software engineer",
      "full stack developer",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "portfolio",
    ],
  },
} as const;

export type Profile = typeof profile;

/**
 * Flattened plain-text version of the profile, injected as the system
 * prompt for the "Ask my resume" chat widget. Because it is derived
 * from the object above, the bot can never fall out of sync with the page.
 */
export function buildResumeContext(): string {
  const p = profile;
  const lines: string[] = [];

  lines.push(`NAME: ${p.name}`);
  lines.push(`ROLE: ${p.role}`);
  lines.push(`LOCATION: ${p.location}`);
  lines.push(`EMAIL: ${p.email}`);
  lines.push(`AVAILABILITY: ${p.availability}`);
  lines.push(`GITHUB: ${p.socials.github}`);
  lines.push(`LINKEDIN: ${p.socials.linkedin}`);
  lines.push("");

  lines.push("ABOUT:");
  p.about.forEach((para) => lines.push(`  ${para}`));
  lines.push("");

  lines.push("SKILLS:");
  p.skills.forEach((g) => {
    const names = g.items.map((i) => `${i.name} (${i.level}/5)`).join(", ");
    lines.push(`  ${g.group}: ${names}`);
  });
  lines.push("");

  lines.push("PROJECTS:");
  p.projects.forEach((proj) => {
    lines.push(`  ${proj.title} (${proj.year}) — ${proj.blurb}`);
    lines.push(`    Status: ${proj.status}`);
    lines.push(`    ${proj.description}`);
    proj.highlights.forEach((h) => lines.push(`    - ${h}`));
    lines.push(`    Tech: ${proj.tags.join(", ")}`);
    if (proj.github) lines.push(`    Repo: ${proj.github}`);
    if (proj.demo) lines.push(`    Live: ${proj.demo}`);
  });
  lines.push("");

  lines.push("EXPERIENCE:");
  p.experience.forEach((e) => {
    lines.push(`  ${e.role} at ${e.org} (${e.period}, ${e.location})`);
    e.points.forEach((pt) => lines.push(`    - ${pt}`));
    lines.push(`    Tech: ${e.tech.join(", ")}`);
  });
  lines.push("");

  lines.push("EDUCATION:");
  p.education.forEach((e) => {
    lines.push(`  ${e.degree}, ${e.school} (${e.period}) — ${e.highlight}`);
    lines.push(`    ${e.details}`);
  });
  lines.push("");

  // Skipped when empty so the assistant doesn't see a bare heading and
  // hallucinate something to fill it.
  if (p.certifications.length) {
    lines.push("CERTIFICATIONS:");
    p.certifications.forEach((c) => lines.push(`  ${c.name} — ${c.issuer}, ${c.year}`));
  }

  return lines.join("\n");
}
