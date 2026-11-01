import { useEffect, useState } from "react"
import { MAX_TIMEOUT, now } from "./clock"
import { useEdition } from "./edition-context"

function isOpen(deadline: number) {
  return now() < deadline
}

/**
 * Whether registration is still open for the active edition, plus where
 * registration CTAs should point. Flips automatically when the deadline passes.
 */
export function useRegistration() {
  const { dates, registrationUrl, registrationClosed } = useEdition()
  const deadline = new Date(dates.registrationClosesISO).getTime()
  const [open, setOpen] = useState(() => isOpen(deadline))

  useEffect(() => {
    let id = 0
    const check = () => {
      const stillOpen = isOpen(deadline)
      setOpen(stillOpen)
      if (stillOpen) id = window.setTimeout(check, Math.min(deadline - now(), MAX_TIMEOUT))
    }
    check()
    return () => window.clearTimeout(id)
  }, [deadline])

  return {
    open,
    href: open ? (registrationUrl ?? "#register") : registrationClosed.href,
  }
}
