import { m, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from "react"
import { useEdition } from "@/lib/edition-context"
import { EASE_LUXE } from "@/lib/motion"
import { useRegistration } from "@/lib/registration"
import { AccentText } from "./primitives/AccentText"
import { Button } from "./primitives/Button"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"
import { WORDMARK_PATHS, WORDMARK_VIEWBOX, wordmarkViewBox } from "./wordmark-geometry"

const OUTLINE_PATHS = [...WORDMARK_PATHS.lead, ...WORDMARK_PATHS.accent]
const SPOTLIGHT =
  "radial-gradient(260px circle at var(--spot-x, -999px) var(--spot-y, -999px), #000 0%, transparent 72%)"

/**
 * Oversized outline of the wordmark behind the CTA. Strokes draw in on first view;
 * an amber copy is revealed under the cursor like a spotlight.
 */
function OutlineWordmark({ spotRef }: { spotRef: RefObject<HTMLDivElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  // Keep a ~1px hairline regardless of how large the outline renders.
  const [strokeWidth, setStrokeWidth] = useState(1)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setStrokeWidth(WORDMARK_VIEWBOX.width / entry.contentRect.width)
    })
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-10 -left-[2%] w-[104%] select-none lg:top-[62px]"
    >
      <svg ref={svgRef} viewBox={wordmarkViewBox} fill="none" className="block h-auto w-full overflow-visible">
        {OUTLINE_PATHS.map((d, index) => (
          <m.path
            key={d}
            d={d}
            className="stroke-white/50"
            strokeWidth={strokeWidth}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 2.4, ease: EASE_LUXE, delay: index * 0.07 }}
          />
        ))}
      </svg>
      <svg
        viewBox={wordmarkViewBox}
        fill="none"
        className="absolute inset-0 block h-auto w-full overflow-visible"
        style={{ maskImage: SPOTLIGHT, WebkitMaskImage: SPOTLIGHT }}
      >
        {OUTLINE_PATHS.map((d) => (
          <path key={d} d={d} className="stroke-amber" strokeWidth={strokeWidth * 2} />
        ))}
      </svg>
    </div>
  )
}

export function Cta() {
  const { cta, registrationClosed } = useEdition()
  const registration = useRegistration()
  const spotRef = useRef<HTMLDivElement>(null)

  function moveSpot(event: PointerEvent<HTMLElement>) {
    const el = spotRef.current
    if (!el || event.pointerType !== "mouse") return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  function hideSpot() {
    spotRef.current?.style.removeProperty("--spot-x")
    spotRef.current?.style.removeProperty("--spot-y")
  }

  return (
    <section
      id="register-cta"
      onPointerMove={moveSpot}
      onPointerLeave={hideSpot}
      className="relative overflow-hidden bg-ink text-white"
    >
      <OutlineWordmark spotRef={spotRef} />
      <Container className="relative py-24 lg:py-[140px]">
        <div className="flex w-full flex-col items-center justify-center gap-7 border border-white px-6 py-20 text-center [word-break:break-word] md:px-20 lg:py-[110px]">
          <Reveal>
            <MonoLabel className="text-[13px] text-amber">
              {registration.open ? cta.eyebrow : registrationClosed.ctaEyebrow}
            </MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <h2 className="max-w-[1000px] font-ox-light text-[48px] leading-[1.087] font-light tracking-[-0.015em] md:text-[72px] lg:text-[92px] lg:leading-[100px]">
              <AccentText text={cta.heading} accentClassName="text-amber" />
            </h2>
          </Reveal>
          <Reveal index={2}>
            <p className="max-w-[620px] font-exo text-[18px] leading-[29px] font-normal">
              {cta.body}
            </p>
          </Reveal>
          <Reveal index={3}>
            <Button variant="gold" href={registration.href}>
              {registration.open ? cta.button : registrationClosed.cta}
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
