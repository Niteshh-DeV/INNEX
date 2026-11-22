import { editionSchema } from "../types"

/** Registration deadline, written once and reused in every string below. */
const CLOSES_DAY = "27 Kartik"
const CLOSES_YEAR = "2083 B.S."

type Crop = { x: number; y: number; width: number; height: number }

/** One partner logo, sized in px as on the Figma sponsor board; artwork lives in /public/images/partners. */
const partner = (name: string, file: string, width: number, height: number, crop?: Crop) => ({
  name,
  images: [{ src: `/images/partners/${file}`, width, height, crop }],
})

/** INNEX 1.0 — 2083 B.S. Copy this file to roll over to the next edition. */
export default editionSchema.parse({
  year: 2026,
  name: "INNEX 1.0",
  version: "1.0",
  motto: "Innovation × Excellence",
  tagline: "Think. Build. Transform.",
  wordmark: { lead: "INN", accent: "EX" },
  organizer: {
    short: "ICEC-FWU",
    full: "Innovative Computer Engineering Club, Far Western University",
  },
  venue: {
    name: "School of Engineering, Far Western University",
    address: "Mahendranagar, Kanchanpur",
  },
  dates: {
    // Approximate AD conversions (Kartik 1, 2083 ≈ 18 Oct 2026).
    // TODO(organizers): confirm AD equivalents of 5–7 Mangsir and 27 Kartik 2083 B.S.
    startISO: "2026-11-21T09:00:00+05:45",
    endISO: "2026-11-23T18:00:00+05:45",
    registrationClosesISO: "2026-11-13T23:59:59+05:45",
    // The 48-hour clock started at 12:45 NPT on Day 01, after the briefing.
    buildStartISO: "2026-11-21T12:45:00+05:45",
  },
  registrationUrl: "https://forms.gle/ZAd2aRTDJbddKWJA7",
  // ICEC-FWU QR → q.me-qr.com redirect → the Google Form above.
  registrationQr: "/images/registration-qr.png",
  nav: {
    links: [
      { label: "ABOUT", href: "#about" },
      { label: "TRACKS", href: "#tracks" },
      { label: "PROCESS", href: "#process" },
      { label: "TIMELINE", href: "#timeline" },
      { label: "FAQ", href: "#faq" },
    ],
    register: "REGISTER",
  },
  hero: {
    eyebrow: "ICEC-FWU PRESENTS  —  INNEX 1.0",
    headline: ["48 Hours.", "No Limits."],
    sub: "Sudurpashchim’s first national-level hackathon. Forty-eight hours to design, build and demonstrate what comes next.",
    primaryCta: "DEPLOY YOUR TEAM  →",
    secondaryCta: "VIEW TRACKS",
    card: {
      label: "SCAN TO REGISTER",
      title: "Join the build.",
      note: `Window closes ${CLOSES_DAY} ${CLOSES_YEAR}`,
      qrLabel: "QR CODE",
      qrHint: "Paste your Google Form QR here",
      urgency: { soon: "CLOSING SOON", final: "FINAL HOURS — SCAN NOW" },
      countdownLabels: ["DAYS", "HRS", "MIN", "SEC"],
    },
    tracksPrompt: "> NOW ACCEPTING:",
    boot: {
      lines: ["> initializing innex_1.0", "> locating sudurpashchim … 28.97°N 80.18°E"],
      open: "> registration: OPEN",
      closed: "> registration: CLOSED",
      ok: "[ OK ]",
      title: "ICEC-FWU  //  SYS BOOT",
      progress: "BOOT",
      skip: "CLICK OR PRESS ANY KEY TO SKIP",
    },
    live: {
      eyebrow: "LIVE NOW  —  INNEX 1.0",
      line2: "Left to build.",
      progress: {
        label: "48-HOUR BUILD",
        elapsed: "ELAPSED",
        start: "5 MANGSIR · 12:45",
        end: "7 MANGSIR · 12:45",
      },
    },
    after: { eyebrow: "INNEX 1.0  —  COMPLETE", headline: ["48 Hours.", "Built."] },
    hud: {
      left: "// SUDURPASHCHIM · NP",
      coordinates: "28.97° N  ·  80.18° E",
      timeLabel: "NPT",
      timeZone: "Asia/Kathmandu",
    },
    details: [
      {
        label: "PRIZE POOL",
        value: "NPR 1.15 Lakhs",
        note: "Total prize pool",
        countUp: true,
      },
      {
        label: "DATES",
        value: "5–7 Mangsir 2083",
        note: "Onsite · three days",
      },
      {
        label: "VENUE",
        value: "Far Western University",
        note: "School of Engineering, Mahendranagar",
      },
      {
        label: "BUILD ENDS",
        value: "7 Mangsir, 12:45",
        note: "Then live demos, judging and awards",
      },
    ],
  },
  ticker: [
    "INNOVATION × EXCELLENCE",
    "48 HOURS",
    "NPR 1.15 LAKHS PRIZE POOL",
    "5–7 MANGSIR 2083",
    "SUDURPASHCHIM’S FIRST NATIONAL-LEVEL HACKATHON",
    `REGISTRATION CLOSES ${CLOSES_DAY.toUpperCase()}`,
  ],
  about: {
    label: "(01)  ABOUT THE EVENT",
    statement: {
      lead: "INNEX 1.0 is Sudurpashchim’s first national-level hackathon — forty-eight hours for the region’s sharpest student builders to design, develop and demonstrate ",
      accent: "what comes next.",
    },
    paragraphs: [
      "Hosted by the Innovative Computer Engineering Club, Far Western University (ICEC-FWU), INNEX brings hands-on innovation to students from across Nepal. Teams of three to four work across eight domains, with mentors on call throughout.",
      "Report to campus, lock in for forty-eight hours of continuous building, then demonstrate your work live to judges from academia and industry. One form handles registration and your idea submission.",
    ],
    figures: [
      { value: "48", label: "HOURS OF BUILDING" },
      { value: "3–4", label: "MEMBERS PER TEAM" },
      { value: "08", label: "TRACKS TO CHOOSE FROM" },
      { value: "3", label: "DAYS ON CAMPUS" },
    ],
  },
  location: {
    label: "(02)  LOCATION",
    heading: {
      lead: "Rooted in ",
      accent: "Sudurpashchim, built for all of Nepal.",
    },
    facts: [
      { label: "REGION", value: "Sudurpashchim Province, Nepal" },
      { label: "HOST CITY", value: "Mahendranagar, Kanchanpur" },
      { label: "COORDINATES", value: "28.97° N  ·  80.18° E" },
      { label: "VENUE", value: "School of Engineering, FWU" },
    ],
  },
  tracks: {
    label: "(03)  TRACKS",
    heading: { lead: "Pick your domain. ", accent: "Hack the problem." },
    intro:
      "Select one of eight tracks at registration. Every track is judged on the same criteria.",
    items: [
      {
        name: "HealthTech & Accessibility",
        description:
          "Smart tools that make care and everyday life accessible to all.",
      },
      {
        name: "EdTech & Learning",
        description:
          "Intelligent platforms that teach better and reach every learner.",
      },
      {
        name: "Climate & Disaster Resilience",
        description: "Early-warning and sustainability tech for a safer Nepal.",
      },
      {
        name: "AgriTech & Rural Economy",
        description:
          "Data and automation that power farms and rural livelihoods.",
      },
      {
        name: "Cybersecurity",
        description: "Defend people, data and systems from digital threats.",
      },
      {
        name: "FinTech & Financial Inclusion",
        description: "Secure, simple digital finance for everyone.",
      },
      {
        name: "AI / Machine Learning",
        description: "Build intelligent systems that learn, predict and solve.",
      },
      {
        name: "Open Innovation",
        description: "IoT, AR/VR, Web3 or any bold, technically sound idea.",
      },
    ],
  },
  process: {
    label: "(04)  PROCESS",
    heading: { lead: "From idea to launch in ", accent: "four steps." },
    intro:
      "One form handles your registration and idea submission. No separate ideathon round.",
    steps: [
      {
        number: "01",
        title: "Submit",
        body: "Send your team, track, problem and solution through one Google Form.",
      },
      {
        number: "02",
        title: "Evaluation",
        body: "Faculty and ICEC-FWU executives score every idea out of 100.",
      },
      {
        number: "03",
        title: "Selection",
        body: "Top teams, within venue and mentor capacity, are notified by email or phone.",
      },
      {
        number: "04",
        title: "Build & Demo",
        body: "Build for 48 hours on campus, then demo live to the judges.",
      },
    ],
    scoringLabel: "SCORING MATRIX  ·  100 PTS",
    scoring: [
      { label: "PROBLEM RELEVANCE", points: 25 },
      { label: "ORIGINALITY", points: 25 },
      { label: "FEASIBILITY IN 48 HOURS", points: 30 },
      { label: "CLARITY", points: 20 },
    ],
  },
  timeline: {
    label: "(05)  TIMELINE",
    heading: { lead: "Three days. ", accent: "48 hours of pure build." },
    clock: { label: "48-HOUR BUILD CLOCK", hours: 48 },
    intro:
      "Live onsite at the School of Engineering, Far Western University — 5 to 7 Mangsir, 2083 B.S.",
    days: [
      {
        label: "DAY 01  ·  5 MANGSIR",
        title: "Boot sequence",
        body: "Check-in, inauguration, briefing, then the 48-hour clock starts.",
      },
      {
        label: "DAY 02  ·  6 MANGSIR",
        title: "Deep build",
        body: "Non-stop building with mentor check-ins and a technical session.",
      },
      {
        label: "DAY 03  ·  7 MANGSIR",
        title: "Demo day",
        body: "Live demos, judging, results and the awards ceremony.",
      },
    ],
  },
  judging: {
    label: "(06)  JUDGING",
    heading: { lead: "How the top ", accent: "build is chosen." },
    intro:
      "A panel of academic and industry judges evaluates every team on the same five parameters. The panel’s decision is final.",
    criteria: [
      { label: "Technical implementation & functionality", percent: 30 },
      { label: "Innovation & originality", percent: 20 },
      { label: "Feasibility & completeness of the prototype", percent: 20 },
      { label: "Problem relevance & understanding", percent: 15 },
      { label: "Presentation & demonstration", percent: 15 },
    ],
  },
  perks: {
    label: "(07)  PERKS",
    heading: { lead: "Full support to ", accent: "power your build." },
    items: [
      {
        number: "01",
        title: "Mentor network",
        body: "Faculty, alumni and industry engineers on call.",
      },
      {
        number: "02",
        title: "Fuel stations",
        body: "Meals and refreshments through all 48 hours, midnight included.",
      },
      {
        number: "03",
        title: "Accommodation",
        body: "Basic accommodation for outstation teams.",
      },
      {
        number: "04",
        title: "Always-on infra",
        body: "Reliable Wi-Fi, power backup and a dedicated build zone.",
      },
      {
        number: "05",
        title: "On-site support",
        body: "First-aid support and quiet rest zones.",
      },
      {
        number: "06",
        title: "Rewards & network",
        body: "NPR 1.15 Lakhs prize pool, plus direct access to judges, mentors and sponsors.",
      },
    ],
  },
  judges: {
    label: "(08)  JUDGES & MENTORS",
    heading: { lead: "Judged by ", accent: "the people who build it." },
    placeholder: "NAME — TO BE ANNOUNCED",
    // TODO(organizers): fill in judges and mentors.
    people: [
      { name: null, photo: null },
      { name: null, photo: null },
      { name: null, photo: null },
      { name: null, photo: null },
    ],
  },
  // Mirrors "Footer/Sponsor footer — logos and role titles" in the INNEX 1.0 Social Posters Figma file.
  partners: {
    label: "(09)  PARTNERS",
    heading: "IN PARTNERSHIP WITH",
    tiers: [
      {
        logoHeight: 74,
        groups: [
          { role: "POWERED BY", partners: [partner("Far Western University", "far-western-university.png", 80.55, 74)] },
          { role: "HOSTED BY", partners: [partner("School of Engineering, FWU", "school-of-engineering-fwu.png", 73.72, 74)] },
          {
            role: "PLATINUM SPONSORS",
            partners: [
              partner("Bheemdatt Municipality", "bheemdatt-municipality.jpg", 95.48, 74),
              partner("Udhyog Banijya Sangh Kanchanpur", "udhyog-banijya-sangh-kanchanpur.jpg", 95.48, 74),
            ],
          },
          { role: "SPECIAL SUPPORTING PARTNER", partners: [partner("Alpha Store", "alpha-store.png", 95.48, 74)] },
          { role: "GOLD SPONSOR", partners: [partner("Laxmi Jewellers", "laxmi-jewellers.png", 95.48, 74)] },
          {
            role: "SILVER SPONSORS",
            partners: [
              partner("Bedkot Municipality", "bedkot-municipality.jpg", 73.41, 73.41, { x: -14.48, y: -14.48, width: 102.27, height: 102.27 }),
              partner("Himani Motors", "himani-motors.png", 183.54, 37.24),
              partner("New Shambhu Sunchandi Pasal", "new-shambhu-sunchandi-pasal.jpg", 78.93, 74, { x: -9.87, y: -42.76, width: 98.83, height: 131.56 }),
            ],
          },
        ],
      },
      {
        logoHeight: 48,
        groups: [
          {
            role: "SUPPORTING PARTNERS",
            partners: [
              partner("GROW", "grow.jpg", 61.94, 48),
              partner("Suraj Itta Udhyog", "suraj-itta-udhyog.jpg", 61.94, 28.43, { x: -10.15, y: -54.83, width: 82.24, height: 129.96 }),
              {
                name: "Western Advance College of Engineering & Management (WACEM)",
                images: [
                  { src: "/images/partners/wacem-seal.jpg", width: 29.48, height: 29.9 },
                  { src: "/images/partners/wacem-wordmark.jpg", width: 41.14, height: 25.14, crop: { x: -7.43, y: -15.43, width: 146.29, height: 103.31 } },
                ],
              },
              partner("Needs Nepal", "needs-nepal.png", 73.92, 48),
              partner("Siddhanath Science Campus", "siddhanath-science-campus.png", 40.6, 48),
              partner("Brixton College", "brixton-college.png", 42.96, 48),
              partner("New Suraj Sun Chandi Gahana Pasal", "new-suraj-sun-chandi-gahana-pasal.jpg", 61.94, 48),
            ],
          },
          { role: "TECHNOLOGY PARTNER", partners: [partner("Nirvix Technology", "nirvix-technology.png", 83.36, 48)] },
          { role: "WEB HOSTING PARTNER", partners: [partner("Kailash Cloud", "kailash-cloud.png", 116.57, 22.19)] },
          { role: "CYBERSECURITY PARTNER", partners: [partner("OWASP Kathmandu", "owasp-kathmandu.png", 42.24, 48)] },
          { role: "BEAUTY PARTNER", partners: [partner("Glow Makeup Studio with Bindu", "glow-makeup-studio.png", 108.39, 25.45)] },
          {
            role: "GADGET PARTNERS",
            partners: [
              partner("USOFT", "usoft.png", 68.8, 48),
              partner("Tech Hub Solution", "tech-hub-solution.png", 60, 48),
              partner("IT Marg", "it-marg.png", 34.56, 48),
              partner("GIB Research Lab", "gib-research-lab.png", 48, 48),
            ],
          },
        ],
      },
      {
        logoHeight: 48,
        groups: [
          {
            role: "FOOD PARTNERS",
            partners: [
              partner("Olive Cafe", "olive-cafe.png", 53.54, 48),
              partner("Kakalu Foods", "kakalu-foods.png", 46.89, 48),
              partner("The Isara Cafe", "the-isara-cafe.jpg", 61.94, 48),
              partner("New Mansoon Hotel", "new-mansoon-hotel.png", 96.87, 28.44),
              partner("Mamtaj Party Palace", "mamtaj-party-palace.png", 128.09, 38.4),
            ],
          },
          {
            role: "CLOTHING PARTNERS",
            partners: [
              partner("Pachyan Wears", "pachyan-wears.jpg", 66.72, 48, { x: 0, y: 0, width: 66.72, height: 66.72 }),
              {
                name: "Student’s Point",
                wordmark: {
                  width: 108.39,
                  lines: [
                    { text: "STUDENT’S", size: 12.84, leading: 14.83, tracking: 0.29, tone: "blue", weight: "extrabold" },
                    { text: "POINT", size: 14.83, leading: 15.97, tracking: 1, tone: "ink", weight: "extrabold" },
                  ],
                },
              },
            ],
          },
          {
            role: "STATIONERY PARTNERS",
            partners: [
              {
                name: "Saraswati Pustak Bhandar",
                wordmark: {
                  width: 108.39,
                  lines: [
                    { text: "SARASWATI", size: 12.84, leading: 15.4, tracking: 0.29, tone: "blue", weight: "extrabold" },
                    { text: "PUSTAK BHANDAR", size: 5.42, leading: 8.27, tracking: 0.71, tone: "ink", weight: "semibold" },
                  ],
                },
              },
              {
                name: "Chaulani Pustak Pasal",
                wordmark: {
                  width: 108.39,
                  lines: [
                    { text: "CHAULANI", size: 12.84, leading: 15.4, tracking: 0.29, tone: "ink", weight: "extrabold" },
                    { text: "PUSTAK PASAL", size: 5.42, leading: 8.27, tracking: 0.71, tone: "blue", weight: "semibold" },
                  ],
                },
              },
              partner("Gyaan Bhandar", "gyaan-bhandar.png", 96.72, 48),
            ],
          },
          {
            role: "SUPPORTED BY",
            partners: [
              partner("Society of Engineering Students, FWU", "society-of-engineering-students-fwu.jpg", 61.44, 47.62),
              partner("Cyber Security Club FWU", "cyber-security-club-fwu.jpg", 61.94, 48),
              partner("Far Western University Youthmappers, Nepal", "fwu-youthmappers.jpg", 61.44, 47.62),
            ],
          },
          {
            role: "COMMUNITY PARTNERS",
            partners: [
              partner("Nepalgunj IT Student’s Connect (NISC)", "nisc.jpg", 61.94, 41.05, { x: -30.25, y: -25.93, width: 122.72, height: 108.03 }),
              partner("School of Democracy", "school-of-democracy.png", 61.94, 48),
              partner("NAST IT Club", "nast-it-club.jpg", 61.94, 48),
              partner("SNSC IT Club", "snsc-it-club.jpg", 61.94, 48),
              partner("Dev Community Nepal", "dev-community-nepal.png", 61.94, 48),
              partner("Department of Computer Science and Engineering", "dcse-fwu.jpg", 61.94, 48),
              partner("Nepal Emerging Youth (NEY)", "nepal-emerging-youth.jpg", 47.32, 48),
            ],
          },
        ],
      },
    ],
  },
  faq: {
    label: "(10)  FAQ",
    heading: { lead: "Quick answers for ", accent: "every team." },
    terminal: {
      command: "innex --help",
      lines: [
        "usage: register → build → demo",
        "  --team      3–4 members",
        "  --tracks    08 domains",
        "  --clock     48 hours onsite",
        `  --deadline  ${CLOSES_DAY} ${CLOSES_YEAR}`,
        "  --prize     NPR 1.15 Lakhs",
      ],
    },
    items: [
      {
        question: "Who can join?",
        answer:
          "Undergraduate students from Far Western University and colleges across Nepal. Interdisciplinary teams are welcome.",
      },
      {
        question: "How big is a team?",
        answer:
          "Three to four members. One member submits the form on behalf of the team.",
      },
      {
        question: "Do I need a finished idea?",
        answer:
          "You submit a short idea with your registration. Screening looks at relevance, originality, feasibility and clarity.",
      },
      {
        question: "When does registration close?",
        answer: `Registration closes on ${CLOSES_DAY} ${CLOSES_YEAR} Shortlisted teams are notified by email or phone.`,
      },
      {
        question: "Can members change later?",
        answer:
          "Team members cannot be changed after shortlisting is confirmed, so list everyone carefully.",
      },
      {
        question: "What should I bring?",
        answer: "Your laptop, charger and any hardware your prototype needs.",
      },
      {
        question: "What if we are not shortlisted?",
        answer:
          "Some teams are waitlisted in case of dropouts. We hope to see you at future ICEC-FWU events.",
      },
    ],
  },
  cta: {
    eyebrow: `REGISTRATION OPEN  ·  CLOSES ${CLOSES_DAY} ${CLOSES_YEAR}`.toUpperCase(),
    heading: { lead: "Ready to build", accent: " the future?" },
    body: "Assemble your squad, pick a track and submit your idea. The 48-hour clock is waiting.",
    button: "DEPLOY YOUR TEAM  →",
  },
  registrationClosed: {
    nav: "SCHEDULE",
    cardLabel: "REGISTRATION CLOSED",
    cardTitle: "Teams are locked in.",
    cta: "VIEW SCHEDULE  →",
    ctaEyebrow: "REGISTRATION CLOSED  ·  SEE YOU ON 5 MANGSIR",
    href: "#timeline",
    prizes: {
      label: "TOTAL PRIZE POOL  ·  NPR",
      total: "1,15,000",
      places: [
        { place: "1ST", amount: "50K" },
        { place: "2ND", amount: "25K" },
        { place: "3RD", amount: "15K" },
      ],
      awardsLabel: "SPECIAL AWARDS",
      awards: [
        { name: "Best Regional Impact", amount: "5K" },
        { name: "Best Hardware / IoT Prototype", amount: "5K" },
        { name: "Best UI/UX and Presentation", amount: "5K" },
        { name: "Best Women-Led Team", amount: "10K" },
        { name: "Best Git Commit", amount: "SURPRISE" },
      ],
    },
  },
  footer: {
    tagline: "Innovation × Excellence · Think. Build. Transform.",
    address:
      "ICEC-FWU · School of Engineering, Far Western University, Mahendranagar, Kanchanpur",
    contactLabel: "// CONTACT",
    contact: {
      email: "icecfwu@gmail.com",
      phone: "+977 9868817010",
      phoneHref: "tel:+9779868817010",
    },
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/icecfwu" },
      { label: "Instagram", href: "https://www.instagram.com/icec_fwu/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/icec-fwu/" },
    ],
    credit: {
      label: "Designed and built by",
      name: "Nitesh Joshi",
      href: "https://www.niteshjoshi.me",
    },
  },
})
