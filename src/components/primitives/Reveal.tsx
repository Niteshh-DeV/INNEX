import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { REVEAL_STAGGER } from "@/lib/motion"
import { observeReveal } from "@/lib/reveal-observer"

/**
 * Fades content up once as it enters the viewport. Pure CSS transition driven by
 * a shared observer, so dozens of these cost almost nothing to render.
 */
export function Reveal({
  index = 0,
  className,
  children,
}: {
  index?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => (ref.current ? observeReveal(ref.current) : undefined), [])
  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={index ? { transitionDelay: `${index * REVEAL_STAGGER}s` } : undefined}
    >
      {children}
    </div>
  )
}
