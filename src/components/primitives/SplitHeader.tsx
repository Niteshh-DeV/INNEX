import type { ReactNode } from "react"
import { cn } from "@/lib/cn"
import { MonoLabel } from "./MonoLabel"
import { Reveal } from "./Reveal"

/** The recurring 240px label column + content column layout. */
export function SplitHeader({
  label,
  labelClassName,
  className,
  children,
}: {
  label: string
  labelClassName: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 lg:flex-row lg:gap-[60px]",
        className,
      )}
    >
      <Reveal className="shrink-0 lg:w-[240px]">
        <MonoLabel className={labelClassName}>{label}</MonoLabel>
      </Reveal>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
