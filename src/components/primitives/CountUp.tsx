import { useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const SINGLE_NUMBER = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/
const DURATION_MS = 1600

/** Strong ease-out, close to the shared cubic-bezier(0.22, 1, 0.36, 1). */
const easeOut = (t: number) => 1 - (1 - t) ** 4

function format(value: number, template: string): string {
  const [whole, fraction = ""] = template.split(".")
  return value
    .toFixed(fraction.length)
    .padStart(whole.length + (fraction ? fraction.length + 1 : 0), "0")
}

/** Counts the single number inside `value` up from zero on first view. Other strings render as-is. */
export function CountUp({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const reduce = useReducedMotion()
  const match = value.match(SINGLE_NUMBER)
  const animated = Boolean(match) && !reduce
  const [display, setDisplay] = useState(() =>
    match && animated ? format(0, match[2]) : "",
  )

  useEffect(() => {
    const numberTemplate = value.match(SINGLE_NUMBER)?.[2]
    if (!numberTemplate || reduce || !inView) return
    const target = Number(numberTemplate)
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      setDisplay(format(easeOut(progress) * target, numberTemplate))
      if (progress < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [reduce, inView, value])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {match && animated ? `${match[1]}${display}${match[3]}` : value}
      </span>
    </span>
  )
}
