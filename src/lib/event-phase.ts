import { useEffect, useState } from "react"
import { MAX_TIMEOUT, now } from "./clock"
import { useEdition } from "./edition-context"

export type EventPhase = "before" | "live" | "after"

function phaseAt(time: number, start: number, end: number): EventPhase {
  return time < start ? "before" : time < end ? "live" : "after"
}

/**
 * Where the edition is relative to its build window: before the clock starts,
 * live during the 48 hours, or after. Switches automatically at each boundary.
 */
export function useEventPhase() {
  const { dates, timeline } = useEdition()
  const buildStart = Date.parse(dates.buildStartISO)
  const buildEnd = buildStart + timeline.clock.hours * 3_600_000
  const [phase, setPhase] = useState(() => phaseAt(now(), buildStart, buildEnd))

  useEffect(() => {
    let id = 0
    const check = () => {
      const time = now()
      setPhase(phaseAt(time, buildStart, buildEnd))
      const next = time < buildStart ? buildStart : time < buildEnd ? buildEnd : null
      if (next !== null) id = window.setTimeout(check, Math.min(next - time + 50, MAX_TIMEOUT))
    }
    check()
    return () => window.clearTimeout(id)
  }, [buildStart, buildEnd])

  return { phase, buildEnd }
}
