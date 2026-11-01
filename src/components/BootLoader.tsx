import { useEffect, useState } from "react"
import { cn } from "@/lib/cn"
import { useEdition } from "@/lib/edition-context"
import { useRegistration } from "@/lib/registration"
import { Wordmark } from "./Wordmark"

/** Must match the key read by the inline script in index.html. */
const SEEN_KEY = "innex-loader-seen"
/** Typing time per line. */
const LINE_MS = 360
/** Pause on the finished readout before revealing. */
const HOLD_MS = 420
/** Never hold the site longer than this waiting for fonts. */
const MAX_WAIT_MS = 2600
const WIPE_MS = 900

/** Set before first paint by the inline script in index.html. */
export function isBooting(): boolean {
  return document.documentElement.hasAttribute("data-booting")
}

/**
 * Launch loader: types the boot sequence, then wipes upward behind an amber scan
 * line to reveal the site. First visit per session only (see index.html); click
 * or any key skips it. Removing `data-booting` un-pauses the hero entrance so it
 * plays as the wipe uncovers it.
 */
export function BootLoader({ onDone }: { onDone: () => void }) {
  const { hero } = useEdition()
  const { open } = useRegistration()
  const { boot } = hero
  const lines = [...boot.lines, open ? boot.open : boot.closed]
  const lengths = lines.map((line) => line.length)
  const total = lengths.reduce((sum, n) => sum + n, 0)

  const [elapsed, setElapsed] = useState(0)
  const [fontsReady, setFontsReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const typingDone = elapsed >= lines.length * LINE_MS

  // Hand over from the static splash and remember the visit.
  useEffect(() => {
    document.getElementById("boot-splash")?.remove()
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1")
    } catch {
      // Storage unavailable (private mode): the loader simply shows again next visit.
    }
    const cap = window.setTimeout(() => setFontsReady(true), MAX_WAIT_MS)
    document.fonts.ready.then(() => setFontsReady(true))
    return () => window.clearTimeout(cap)
  }, [])

  // Drive the typing from elapsed time.
  useEffect(() => {
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = now - start
      setElapsed(t)
      if (t < lines.length * LINE_MS) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [lines.length])

  // Reveal once the readout is complete and the hero's fonts are in.
  useEffect(() => {
    if (!typingDone || !fontsReady || leaving) return
    const id = window.setTimeout(() => setLeaving(true), HOLD_MS)
    return () => window.clearTimeout(id)
  }, [typingDone, fontsReady, leaving])

  // Skip on any click or key.
  useEffect(() => {
    const skip = () => setLeaving(true)
    window.addEventListener("pointerdown", skip)
    window.addEventListener("keydown", skip)
    return () => {
      window.removeEventListener("pointerdown", skip)
      window.removeEventListener("keydown", skip)
    }
  }, [])

  useEffect(() => {
    if (!leaving) return
    document.documentElement.removeAttribute("data-booting")
    const id = window.setTimeout(onDone, WIPE_MS + 50)
    return () => window.clearTimeout(id)
  }, [leaving, onDone])

  const typedPerLine = lengths.map((length, i) =>
    leaving ? length : Math.round(Math.min(1, Math.max(0, (elapsed - i * LINE_MS) / LINE_MS)) * length),
  )
  const typed = typedPerLine.reduce((sum, n) => sum + n, 0)
  const progress = leaving ? 1 : typingDone && !fontsReady ? 0.99 : typed / total
  const activeLine = typedPerLine.findIndex((count, i) => count < lengths[i])
  const wipeTransition = {
    transitionProperty: "translate",
    transitionDuration: `${WIPE_MS}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  }
  const caret = (
    <span className="ml-1 inline-block h-[2px] w-[0.65em] animate-caret bg-amber align-baseline" />
  )

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Wipe = outer slides up while the inner content slides down by the same amount:
          the terminal stays still and is cut away by a moving edge, all on the compositor. */}
      <div
        className={cn("absolute inset-0 overflow-hidden", leaving && "-translate-y-full")}
        style={wipeTransition}
      >
      <div
        className={cn("absolute inset-0 bg-ink text-white", leaving && "translate-y-full")}
        style={wipeTransition}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1.2px)] bg-size-[22px_22px]" />
        <div className="absolute inset-3 border border-white/15 md:inset-5" />

        <div className="absolute inset-x-6 top-8 flex items-center justify-between gap-6 md:inset-x-10 md:top-10 lg:inset-x-20">
          <Wordmark className="h-4 md:h-5" />
          <p className="font-mono text-[10px] tracking-[0.16em] whitespace-pre text-white/50 md:text-[11px]">
            {boot.title}
          </p>
        </div>

        <div className="absolute top-[calc(50%-56px)] right-6 left-6 font-mono text-[12px] leading-[28px] tracking-[0.06em] md:right-10 md:left-10 md:text-[14px] lg:left-20">
          {lines.map((line, i) => {
            const done = typedPerLine[i] === lengths[i]
            const last = i === lines.length - 1
            return (
              <p key={i} className={cn("whitespace-pre-wrap", !done && typedPerLine[i] === 0 && "invisible")}>
                <span className={cn(last && done ? "text-amber" : "text-white/85")}>
                  {line.slice(0, typedPerLine[i])}
                </span>
                {done && !last && (
                  <span className="ml-4 inline-block whitespace-pre text-amber">{boot.ok}</span>
                )}
                {(i === activeLine || (activeLine === -1 && last)) && caret}
              </p>
            )
          })}
        </div>

        <div className="absolute inset-x-6 bottom-8 flex flex-col gap-3 md:inset-x-10 md:bottom-10 lg:inset-x-20">
          <div className="flex items-end justify-between gap-6 font-mono text-[10px] tracking-[0.16em] md:text-[11px]">
            <span className="text-white/70 tabular-nums">
              {`${boot.progress} ${String(Math.round(progress * 100)).padStart(3, "0")}%`}
            </span>
            <span className="hidden text-white/40 sm:inline">{boot.skip}</span>
            <span className="whitespace-pre text-white/50">{hero.hud.coordinates}</span>
          </div>
          <div className="h-px w-full bg-white/15">
            <div
              className="h-px origin-left bg-amber transition-transform duration-200 ease-out"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      </div>
      {/* Amber scan line riding the wipe edge. */}
      <div className={cn("absolute inset-x-0 bottom-0 h-[2px] bg-amber", !leaving && "opacity-0")} />
      </div>
    </div>
  )
}
