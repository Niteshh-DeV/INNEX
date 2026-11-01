import { useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=_"
const LOWER = "abcdefghijklmnopqrstuvwxyz0123456789#%&*+/<>=_"
const DIGITS = "0123456789"
const FRAME_MS = 45

function glyphFor(char: string) {
  const set = /\d/.test(char) ? DIGITS : char === char.toLowerCase() ? LOWER : UPPER
  return set[Math.floor(Math.random() * set.length)]
}

/**
 * Terminal-style decode: characters cycle through glyphs and resolve left to right.
 * Intended for monospaced text so the width never shifts. Plays once on first view
 * (unless `onView` is false) and again whenever `replay` changes.
 */
export function ScrambleText({
  text,
  onView = true,
  replay = 0,
  className,
}: {
  text: string
  onView?: boolean
  replay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" })
  const reduce = useReducedMotion()
  const [output, setOutput] = useState(text)

  useEffect(() => {
    setOutput(text)
    if (reduce || (onView ? !inView : replay === 0)) return
    const duration = Math.min(900, 280 + text.length * 22)
    const start = performance.now()
    let last = 0
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      if (now - last >= FRAME_MS || progress === 1) {
        last = now
        const resolved = Math.floor(progress * text.length)
        let next = ""
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          next += i < resolved || !/[A-Za-z0-9]/.test(char) ? char : glyphFor(char)
        }
        setOutput(next)
      }
      if (progress < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [text, inView, onView, replay, reduce])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  )
}
