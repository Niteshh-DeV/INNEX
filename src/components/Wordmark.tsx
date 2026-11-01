import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { WORDMARK_PATHS, wordmarkViewBox } from "./wordmark-geometry"

/**
 * The INNEX wordmark — INN in brand blue, EX in amber — drawn from the logo's
 * letterforms. Size it with a height class (e.g. `h-5`); width follows.
 */
export function Wordmark({ className }: { className?: string }) {
  const { wordmark } = useEdition()
  return (
    <svg
      viewBox={wordmarkViewBox}
      role="img"
      aria-label={`${wordmark.lead}${wordmark.accent}`}
      className={cn("block w-auto shrink-0", className)}
    >
      <g className="fill-blue">
        {WORDMARK_PATHS.lead.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="fill-amber">
        {WORDMARK_PATHS.accent.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}
