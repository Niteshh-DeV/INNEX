import { m, useMotionValueEvent, useScroll, useTransform } from "motion/react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/cn"

const pad = (value: number) => String(value).padStart(2, "0")

function readout(progress: number, hours: number) {
  const total = Math.round(progress * hours * 3600)
  return `T+ ${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

function Ticks({ hours, className }: { hours: number; className: string }) {
  return (
    <div className="absolute inset-0 flex items-end justify-between">
      {Array.from({ length: hours + 1 }, (_, hour) => (
        <span
          key={hour}
          className={cn(
            "w-px",
            hour % 12 === 0 ? "h-6" : hour % 6 === 0 ? "h-4" : "h-2.5",
            className,
          )}
        />
      ))}
    </div>
  )
}

/** Scroll-scrubbed ruler of the build window: hour ticks fill amber with a live T+ readout. */
export function BuildClock({ label, hours }: { label: string; hours: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 30%"] })
  const clipPath = useTransform(scrollYProgress, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`)
  const left = useTransform(scrollYProgress, (v) => `${v * 100}%`)
  const labelStep = hours % 12 === 0 ? 12 : hours

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (readoutRef.current) readoutRef.current.textContent = readout(v, hours)
  })
  useEffect(() => {
    if (readoutRef.current) readoutRef.current.textContent = readout(scrollYProgress.get(), hours)
  }, [hours, scrollYProgress])

  return (
    <div ref={ref} aria-hidden="true" className="flex w-full flex-col gap-4 select-none">
      <div className="flex items-end justify-between gap-6 font-mono text-[12px] leading-[normal] tracking-[0.16em]">
        <span className="text-blue">{label}</span>
        <span ref={readoutRef} className="text-ink tabular-nums">
          {readout(0, hours)}
        </span>
      </div>
      <div className="relative h-6">
        <Ticks hours={hours} className="bg-ink/25" />
        <m.div className="absolute inset-0" style={{ clipPath }}>
          <Ticks hours={hours} className="bg-amber" />
        </m.div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/25" />
        <m.div
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-amber"
          style={{ scaleX: scrollYProgress }}
        />
        <m.span
          className="absolute -bottom-[4px] size-[9px] -translate-x-1/2 bg-amber"
          style={{ left }}
        />
      </div>
      <div className="relative h-4 font-mono text-[11px] leading-[normal] tracking-[0.16em] text-ink/75">
        {Array.from({ length: hours / labelStep + 1 }, (_, i) => i * labelStep).map((hour) => (
          <span
            key={hour}
            className={cn(
              "absolute top-0",
              hour === 0 ? "left-0" : hour === hours ? "right-0" : "-translate-x-1/2",
            )}
            style={hour === 0 || hour === hours ? undefined : { left: `${(hour / hours) * 100}%` }}
          >
            {pad(hour)}H
          </span>
        ))}
      </div>
    </div>
  )
}
