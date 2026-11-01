import { useEffect, useState } from "react"
import { onIdle } from "@/lib/idle"
import { useMarkSectionsReady } from "@/lib/sections-ready"
import { About } from "./About"
import { Cta } from "./Cta"
import { Faq } from "./Faq"
import { JudgesPartners } from "./JudgesPartners"
import { Judging } from "./Judging"
import { Location } from "./Location"
import { Perks } from "./Perks"
import { Process } from "./Process"
import { Timeline } from "./Timeline"
import { Tracks } from "./Tracks"

export { Footer } from "./Footer"

const SECTIONS = [About, Location, Tracks, Process, Timeline, Judging, Perks, JudgesPartners, Faq, Cta]
const BATCH = 2

/**
 * Everything after the hero + ticker, shipped as its own chunk. Sections mount a
 * couple at a time in idle slots so no single render blocks input; deep links
 * (`/#faq`) mount everything at once so the target exists immediately.
 */
export default function BelowFold() {
  const markSectionsReady = useMarkSectionsReady()
  const [count, setCount] = useState(() =>
    window.location.hash.length > 1 ? SECTIONS.length : BATCH,
  )
  const complete = count >= SECTIONS.length

  useEffect(() => {
    if (complete) {
      markSectionsReady()
      return
    }
    return onIdle(() => setCount((current) => current + BATCH), 600)
  }, [complete, count, markSectionsReady])

  return SECTIONS.slice(0, count).map((Section, index) => <Section key={index} />)
}
