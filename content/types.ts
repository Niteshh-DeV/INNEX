import { z } from "zod/mini"

/** Copy split into a plain lead, a highlighted accent and an optional trailing part. */
export const accentTextSchema = z.object({
  lead: z.string(),
  accent: z.string(),
  trail: z.optional(z.string()),
})

const labelValueSchema = z.object({ label: z.string(), value: z.string() })
const stepSchema = z.object({
  number: z.string(),
  title: z.string(),
  body: z.string(),
})

export const editionSchema = z.object({
  year: z.int(),
  name: z.string(),
  version: z.string(),
  motto: z.string(),
  tagline: z.string(),
  wordmark: z.object({ lead: z.string(), accent: z.string() }),
  organizer: z.object({ short: z.string(), full: z.string() }),
  venue: z.object({ name: z.string(), address: z.string() }),
  dates: z.object({
    /** Gregorian (AD) timestamps used for the countdown and structured data. */
    startISO: z.string(),
    endISO: z.string(),
    registrationClosesISO: z.string(),
    /** When the 48-hour build clock starts; it ends `timeline.clock.hours` later. */
    buildStartISO: z.string(),
  }),
  /** Phase 1: external Google Form. `null` keeps CTAs pointing at the on-page QR card. */
  registrationUrl: z.nullable(z.url()),
  /** Path under /public, e.g. /images/registration-qr.png. `null` renders the placeholder. */
  registrationQr: z.nullable(z.string()),
  nav: z.object({
    links: z.array(z.object({ label: z.string(), href: z.string() })),
    register: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.tuple([z.string(), z.string()]),
    sub: z.string(),
    primaryCta: z.string(),
    secondaryCta: z.string(),
    card: z.object({
      label: z.string(),
      title: z.string(),
      note: z.string(),
      qrLabel: z.string(),
      qrHint: z.string(),
      urgency: z.object({ soon: z.string(), final: z.string() }),
      countdownLabels: z.tuple([
        z.string(),
        z.string(),
        z.string(),
        z.string(),
      ]),
    }),
    tracksPrompt: z.string(),
    /** First-visit launch loader. */
    boot: z.object({
      lines: z.array(z.string()),
      open: z.string(),
      closed: z.string(),
      ok: z.string(),
      title: z.string(),
      progress: z.string(),
      skip: z.string(),
    }),
    /** Headline/eyebrow overrides while the build clock is running and after it ends. */
    live: z.object({ eyebrow: z.string(), line2: z.string() }),
    after: z.object({ eyebrow: z.string(), headline: z.tuple([z.string(), z.string()]) }),
    hud: z.object({
      left: z.string(),
      coordinates: z.string(),
      timeLabel: z.string(),
      /** IANA zone for the live clock, e.g. Asia/Kathmandu. */
      timeZone: z.string(),
    }),
    details: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        note: z.string(),
        countUp: z.optional(z.boolean()),
      }),
    ),
  }),
  ticker: z.array(z.string()),
  about: z.object({
    label: z.string(),
    statement: accentTextSchema,
    paragraphs: z.array(z.string()),
    figures: z.array(labelValueSchema),
  }),
  location: z.object({
    label: z.string(),
    heading: accentTextSchema,
    facts: z.array(labelValueSchema),
  }),
  tracks: z.object({
    label: z.string(),
    heading: accentTextSchema,
    intro: z.string(),
    items: z.array(z.object({ name: z.string(), description: z.string() })),
  }),
  process: z.object({
    label: z.string(),
    heading: accentTextSchema,
    intro: z.string(),
    steps: z.array(stepSchema),
    scoringLabel: z.string(),
    scoring: z.array(z.object({ label: z.string(), points: z.number() })),
  }),
  timeline: z.object({
    label: z.string(),
    heading: accentTextSchema,
    clock: z.object({ label: z.string(), hours: z.number() }),
    intro: z.string(),
    days: z.array(
      z.object({ label: z.string(), title: z.string(), body: z.string() }),
    ),
  }),
  judging: z.object({
    label: z.string(),
    heading: accentTextSchema,
    intro: z.string(),
    criteria: z.array(z.object({ label: z.string(), percent: z.number() })),
  }),
  perks: z.object({
    label: z.string(),
    heading: accentTextSchema,
    items: z.array(stepSchema),
  }),
  judges: z.object({
    label: z.string(),
    heading: accentTextSchema,
    placeholder: z.string(),
    people: z.array(
      z.object({ name: z.nullable(z.string()), photo: z.nullable(z.string()) }),
    ),
  }),
  partners: z.object({
    label: z.string(),
    heading: z.string(),
    note: z.string(),
    placeholder: z.string(),
    logos: z.array(
      z.object({ name: z.nullable(z.string()), logo: z.nullable(z.string()) }),
    ),
  }),
  faq: z.object({
    label: z.string(),
    heading: accentTextSchema,
    terminal: z.object({ command: z.string(), lines: z.array(z.string()) }),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  cta: z.object({
    eyebrow: z.string(),
    heading: accentTextSchema,
    body: z.string(),
    button: z.string(),
  }),
  /** Copy used automatically once `dates.registrationClosesISO` has passed. */
  registrationClosed: z.object({
    nav: z.string(),
    cardLabel: z.string(),
    cardTitle: z.string(),
    cardNote: z.string(),
    cta: z.string(),
    ctaEyebrow: z.string(),
    href: z.string(),
  }),
  footer: z.object({
    tagline: z.string(),
    address: z.string(),
    contactLabel: z.string(),
    contact: z.object({ email: z.email(), phone: z.string(), phoneHref: z.string() }),
    socials: z.array(
      z.object({ label: z.string(), href: z.nullable(z.url()) }),
    ),
    credit: z.object({ label: z.string(), name: z.string(), href: z.url() }),
  }),
})

export type Edition = z.infer<typeof editionSchema>
export type AccentText = z.infer<typeof accentTextSchema>
