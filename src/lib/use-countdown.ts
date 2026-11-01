import { useEffect, useState } from "react"
import { now } from "./clock"

export type CountdownParts = [days: number, hours: number, minutes: number, seconds: number]

function partsUntil(target: number): CountdownParts {
  const remaining = Math.max(0, target - now())
  const totalSeconds = Math.floor(remaining / 1000)
  return [
    Math.floor(totalSeconds / 86400),
    Math.floor((totalSeconds % 86400) / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
}

export function useCountdown(targetISO: string): CountdownParts {
  const target = new Date(targetISO).getTime()
  const [parts, setParts] = useState(() => partsUntil(target))

  useEffect(() => {
    setParts(partsUntil(target))
    const id = window.setInterval(() => setParts(partsUntil(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  return parts
}
