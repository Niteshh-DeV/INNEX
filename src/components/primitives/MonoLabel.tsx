import type { ReactNode } from "react"
import { cn } from "@/lib/cn"
import { ScrambleText } from "./ScrambleText"

/** Tiny uppercase monospaced label, e.g. `(01)  ABOUT THE EVENT`. Decodes on first view. */
export function MonoLabel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p
      className={cn(
        "font-mono leading-[normal] tracking-[0.16em] whitespace-pre-wrap [word-break:break-word]",
        className,
      )}
    >
      {typeof children === "string" ? <ScrambleText text={children} /> : children}
    </p>
  )
}
