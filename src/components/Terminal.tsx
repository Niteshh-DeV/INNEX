import { useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/cn"

const CHAR_MS = 45
const LINE_MS = 160

/**
 * Hairline terminal that types a command and prints its output once in view.
 * Every line is laid out up front (just hidden) so typing never shifts the page.
 */
export function Terminal({
  title,
  command,
  lines,
  className,
}: {
  title: string
  command: string
  lines: string[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const total = command.length + lines.length
  const [step, setStep] = useState(0)
  const shown = reduce ? total : step
  const done = shown >= total

  useEffect(() => {
    if (reduce || !inView) return
    let current = 0
    let id = window.setTimeout(function tick() {
      current += 1
      setStep(current)
      if (current < total) id = window.setTimeout(tick, current < command.length ? CHAR_MS : LINE_MS)
    }, 300)
    return () => window.clearTimeout(id)
  }, [inView, reduce, total, command.length])

  const typed = Math.min(shown, command.length)
  const printed = Math.max(0, shown - command.length)
  const caret = <span className="inline-block h-[1.05em] w-[0.6em] translate-y-[0.18em] animate-caret bg-amber" />

  return (
    <div ref={ref} className={cn("border border-ink bg-ink font-mono text-white", className)}>
      <p className="sr-only">{[`$ ${command}`, ...lines].join("\n")}</p>
      <div aria-hidden="true">
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-2.5 text-[11px] leading-[normal] tracking-[0.16em]">
          <span className="text-white/60">{title}</span>
          <span className={done ? "text-amber" : "text-white/60"}>{done ? "READY" : "RUNNING"}</span>
        </div>
        <div className="overflow-x-auto px-4 py-4 text-[12px] leading-[1.9] whitespace-pre">
          <p>
            <span className="text-amber">$ </span>
            {command.slice(0, typed)}
            <span className="invisible">{command.slice(typed)}</span>
            {printed === 0 && !done && caret}
          </p>
          {lines.map((line, index) => (
            <p key={index} className={cn(index >= printed && "invisible")}>
              {line}
            </p>
          ))}
          <p className={cn(!done && "invisible")}>
            <span className="text-amber">$ </span>
            {caret}
          </p>
        </div>
      </div>
    </div>
  )
}
