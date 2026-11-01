import { useReducedMotion } from "motion/react"
import { useRef, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { SmartLink } from "./SmartLink"

type ButtonProps = {
  variant: "gold" | "outline"
  href: string
  children: ReactNode
  className?: string
}

const MAGNET_LIMIT = 10

const variants = {
  gold: "bg-amber text-ink font-chakra-semibold hover:bg-white",
  outline:
    "border border-white text-white font-chakra-semibold hover:border-amber hover:bg-amber/10",
}

/** Sharp-cornered CTA. Gold buttons get a subtle magnetic pull on fine pointers. */
export function Button({ variant, href, children, className }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const magnetic = variant === "gold" && !reduce

  function handleMove(event: PointerEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!magnetic || !el || event.pointerType !== "mouse") return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAGNET_LIMIT
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAGNET_LIMIT
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }

  // A trailing arrow gets its own span so it can nudge forward on hover.
  const arrow = typeof children === "string" && children.endsWith("→")
  const content = arrow ? (
    <>
      {children.slice(0, -1)}
      <span className="inline-block transition-transform duration-[400ms] ease-out group-hover:translate-x-1">
        →
      </span>
    </>
  ) : (
    children
  )

  function handleLeave() {
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <SmartLink
      ref={ref}
      href={href}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-[2px] px-[34px] py-[18px] text-[13px] leading-[normal] tracking-[0.12em] whitespace-pre",
        "transition-[background-color,border-color,color,transform] duration-[400ms] ease-out",
        variants[variant],
        className,
      )}
    >
      {content}
    </SmartLink>
  )
}
