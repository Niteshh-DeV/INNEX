import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/** 1440 design grid: 80px gutters on desktop, fluid below. */
export function Container({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-20",
        className,
      )}
    >
      {children}
    </div>
  )
}
