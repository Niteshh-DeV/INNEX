import { useEffect, useState, type ReactNode } from "react"
import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { now } from "@/lib/clock"
import { useEventPhase } from "@/lib/event-phase"
import { useRegistration } from "@/lib/registration"
import { useCountdown } from "@/lib/use-countdown"
import { Button } from "./primitives/Button"
import { Container } from "./primitives/Container"
import { CountUp } from "./primitives/CountUp"
import { MonoLabel } from "./primitives/MonoLabel"
import { ScrambleText } from "./primitives/ScrambleText"
import { ReactiveBackground } from "./ReactiveBackground"
import { SudurpashchimIllustration } from "./SudurpashchimIllustration"

/** Amber viewfinder corners and a sweeping scan line over the QR. */
function ScannerFrame() {
  const corner = "absolute size-5 border-amber"
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={cn(corner, "top-0 left-0 border-t-2 border-l-2")} />
      <span className={cn(corner, "top-0 right-0 border-t-2 border-r-2")} />
      <span className={cn(corner, "bottom-0 left-0 border-b-2 border-l-2")} />
      <span className={cn(corner, "right-0 bottom-0 border-r-2 border-b-2")} />
      <div className="absolute inset-x-3 top-3 animate-scan [--scan-distance:250px] motion-reduce:hidden">
        <div className="-mt-6 h-6 bg-linear-to-b from-amber/0 to-amber/15" />
        <div className="h-px bg-amber" />
      </div>
    </div>
  )
}

/**
 * Local time at the venue, ticking every second. The HUD only shows from `md` up,
 * so the (costly to construct) time-zone formatter is created only when visible.
 */
function LiveClock({ timeZone }: { timeZone: string }) {
  const [text, setText] = useState("--:--:--")
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    let id = 0
    let format: Intl.DateTimeFormat | null = null
    const tick = () => format && setText(format.format(new Date(now())))
    const sync = () => {
      window.clearInterval(id)
      if (!query.matches) return
      format ??= new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      tick()
      id = window.setInterval(tick, 1000)
    }
    sync()
    query.addEventListener("change", sync)
    return () => {
      window.clearInterval(id)
      query.removeEventListener("change", sync)
    }
  }, [timeZone])
  return <time className="tabular-nums">{text}</time>
}

function RegistrationCard() {
  const { hero, dates, registrationQr, registrationUrl, registrationClosed } =
    useEdition()
  const { card } = hero
  const countdown = useCountdown(dates.registrationClosesISO)
  const { open } = useRegistration()
  const [daysLeft] = countdown
  const qrSrc = registrationQr
    ? `${import.meta.env.BASE_URL}${registrationQr.replace(/^\/+/, "")}`
    : null
  // Urgency ramps up as the deadline approaches.
  const urgency = !open ? "closed" : daysLeft < 1 ? "final" : daysLeft < 7 ? "soon" : "normal"
  const label = !open
    ? registrationClosed.cardLabel
    : urgency === "final"
      ? card.urgency.final
      : urgency === "soon"
        ? card.urgency.soon
        : card.label

  const qr = (
    <div className="relative flex h-[276px] w-full flex-col items-center justify-center gap-[6px] rounded-[2px] bg-white text-[12px] leading-[normal] text-ink">
      {qrSrc ? (
        <>
          <img
            src={qrSrc}
            alt="QR code linking to the registration form"
            className="size-[236px] object-contain"
          />
          <ScannerFrame />
        </>
      ) : (
        <>
          <p className="font-mono tracking-[0.16em]">{card.qrLabel}</p>
          <p className="font-exo font-normal">{card.qrHint}</p>
        </>
      )}
    </div>
  )

  return (
    <div
      id="register"
      className={cn(
        "flex w-full flex-col items-start gap-[18px] border bg-white p-8 transition-colors duration-700 [word-break:break-word] sm:max-w-[420px] lg:w-[340px] lg:shrink-0",
        urgency === "final" ? "border-amber outline-2 outline-offset-4 outline-amber" : "border-white",
      )}
    >
      <MonoLabel className="text-[12px] text-amber-ink">{label}</MonoLabel>
      <p className="font-ox-medium text-[36px] leading-[40px] font-medium text-ink">
        {open ? card.title : registrationClosed.cardTitle}
      </p>
      <p className="font-exo text-[14px] leading-[normal] font-normal text-ink">
        {open ? card.note : registrationClosed.cardNote}
      </p>
      {open &&
        (registrationUrl ? (
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            {qr}
          </a>
        ) : (
          qr
        ))}
      {open && (
      <div
        className="flex w-full items-start border-t border-ink/10 pt-[18px]"
        role="timer"
        aria-label="Time until registration closes"
      >
        {countdown.map((part, index) => (
          <div
            key={card.countdownLabels[index]}
            className="flex min-w-0 flex-1 flex-col items-start gap-1"
          >
            <p
              className={cn(
                "font-orbitron text-[30px] leading-[34px] font-normal tabular-nums transition-colors duration-700",
                urgency === "soon" || urgency === "final" ? "text-amber-ink" : "text-ink",
              )}
            >
              {String(part).padStart(2, "0")}
            </p>
            <p className="font-mono text-[11px] leading-[normal] tracking-[0.16em] text-amber-ink">
              {card.countdownLabels[index]}
            </p>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

/** HH:MM:SS left in the build window, each glyph in a fixed cell so the headline never jitters. */
function BuildCountdown({ end }: { end: number }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, end - now()))
  useEffect(() => {
    const id = window.setInterval(() => setRemaining(Math.max(0, end - now())), 1000)
    return () => window.clearInterval(id)
  }, [end])
  const total = Math.floor(remaining / 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  const text = `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
  return (
    <span aria-hidden="true">
      {[...text].map((char, i) => (
        <span key={i} className={cn("inline-block text-center", char === ":" ? "w-[0.32em]" : "w-[0.6em]")}>
          {char}
        </span>
      ))}
    </span>
  )
}

/** `> NOW ACCEPTING: <track>` — decodes through every track in turn. */
function NowAccepting() {
  const { hero, tracks } = useEdition()
  const [index, setIndex] = useState(0)
  const count = tracks.items.length
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 2600)
    return () => window.clearInterval(id)
  }, [count])

  return (
    <>
      <p className="sr-only">
        {`${hero.tracksPrompt} ${tracks.items.map((track) => track.name).join(", ")}`}
      </p>
      <p
        aria-hidden="true"
        className="min-h-[44px] font-mono text-[13px] leading-[22px] tracking-[0.16em] whitespace-pre-wrap text-white/70 sm:min-h-0"
      >
        <span className="text-amber">{hero.tracksPrompt}</span>{" "}
        <ScrambleText
          text={tracks.items[index].name.toUpperCase()}
          onView={false}
          replay={index + 1}
          className="text-white"
        />
        <span className="ml-1 inline-block h-[2px] w-[0.6em] animate-caret bg-amber align-baseline" />
      </p>
    </>
  )
}

function detailBorders(index: number) {
  return cn(
    index > 0 && "border-t border-white sm:border-t-0",
    index % 2 === 1 && "sm:border-l sm:pl-7",
    index === 2 && "sm:border-t lg:border-t-0 lg:border-l lg:pl-7",
    index === 3 && "sm:border-t lg:border-t-0",
  )
}

export function Hero() {
  const { hero, registrationClosed, version } = useEdition()
  const registration = useRegistration()
  const { phase, buildEnd } = useEventPhase()

  // The headline follows the event: promise → live countdown → done.
  const eyebrow = phase === "live" ? hero.live.eyebrow : phase === "after" ? hero.after.eyebrow : hero.eyebrow
  const headline: ReactNode[] =
    phase === "live"
      ? [<BuildCountdown key="clock" end={buildEnd} />, hero.live.line2]
      : phase === "after"
        ? hero.after.headline
        : hero.headline

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      <ReactiveBackground phase={phase} version={version} />

      <Container className="relative z-10 flex flex-col gap-14 pt-[140px] pb-16 md:pb-10 lg:flex-row lg:items-start lg:gap-20 lg:pt-[200px] lg:pb-[60px]">
        {/* Clear band above the card where the background canvas draws the dot-matrix wordmark. */}
        <div
          data-figure-slot
          aria-hidden="true"
          className="pointer-events-none absolute top-[100px] right-6 hidden h-[46px] w-[238px] md:right-10 md:block lg:top-[106px] lg:right-20 lg:h-[80px] lg:w-[414px]"
        />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[30px]">
          <div className="animate-fade-up">
            <MonoLabel className="text-[13px] tracking-[0.22em] text-amber">{eyebrow}</MonoLabel>
          </div>
          <h1 className="flex w-full flex-col font-ox-light text-[clamp(56px,9.45vw,136px)] leading-[0.956] font-light tracking-[-0.02em] [word-break:break-word]">
            {phase === "live" && <span className="sr-only">{hero.live.eyebrow}</span>}
            {headline.map((line, index) => (
              // Each line rises out of its own mask; padding keeps glyph tops unclipped.
              <span key={`${phase}-${index}`} className="-my-[0.08em] block overflow-hidden py-[0.08em]">
                <span
                  className={cn("block animate-rise", index === 1 && "text-amber")}
                  style={{ animationDelay: `${150 + index * 120}ms` }}
                >
                  {line}
                  {index === headline.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="ml-[0.1em] inline-block h-[0.07em] w-[0.42em] animate-caret bg-amber"
                    />
                  )}
                </span>
              </span>
            ))}
          </h1>
          {registration.open && (
            <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
              <NowAccepting />
            </div>
          )}
          {/* Rendered immediately (no fade): this paragraph is the mobile LCP element. */}
          <p className="max-w-[560px] font-exo text-[17px] leading-[1.63] font-normal lg:text-[19px] lg:leading-[31px]">
            {hero.sub}
          </p>
          <div
            className="flex animate-fade-up flex-wrap items-start gap-4 pt-[10px]"
            style={{ animationDelay: "420ms" }}
          >
            <Button variant="gold" href={registration.href}>
              {registration.open ? hero.primaryCta : registrationClosed.cta}
            </Button>
            <Button variant="outline" href="#tracks">
              {hero.secondaryCta}
            </Button>
          </div>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "260ms" }}>
          <RegistrationCard />
        </div>
      </Container>

      <Container className="relative z-10 hidden items-center justify-between pb-5 font-mono text-[11px] leading-[normal] tracking-[0.16em] text-white/60 md:flex">
        <span>{hero.hud.left}</span>
        <span className="whitespace-pre">
          {`${hero.hud.coordinates}   ·   ${hero.hud.timeLabel} `}
          <LiveClock timeZone={hero.hud.timeZone} />
        </span>
      </Container>

      {/* Anchors the 7% echo so its base sits 29px into the details band, as in the design. */}
      <div className="relative h-0 w-full" aria-hidden="true">
        <div className="pointer-events-none absolute inset-x-0 -bottom-[29px]">
          <SudurpashchimIllustration variant="echo" />
        </div>
      </div>

      <Container className="relative z-10">
        <dl className="grid border-t border-white [word-break:break-word] sm:grid-cols-2 lg:flex">
          {hero.details.map((detail, index) => (
            <div
              key={detail.label}
              className={cn(
                "flex min-w-0 flex-col gap-[10px] pt-[34px] pb-10 pr-7 lg:flex-1",
                detailBorders(index),
              )}
            >
              <dt className="font-mono text-[11px] leading-[normal] tracking-[0.16em] whitespace-nowrap text-amber">
                {detail.label}
              </dt>
              <dd className="font-ox-medium text-[30px] leading-[1.12] font-medium lg:text-[34px] lg:leading-[38px]">
                {detail.countUp ? (
                  <CountUp value={detail.value} />
                ) : (
                  detail.value
                )}
              </dd>
              <dd className="font-exo text-[13px] leading-[normal] font-normal">
                {detail.note}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
