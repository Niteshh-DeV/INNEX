/**
 * Single source of "now" for every time-based UI (countdown, registration,
 * event phase, urgency). Append `?now=2026-11-22T10:00` to the URL to preview
 * the site at any moment; time keeps ticking from that point.
 */
const offset = (() => {
  if (typeof window === "undefined") return 0
  const requested = new URLSearchParams(window.location.search).get("now")
  const target = requested ? Date.parse(requested) : Number.NaN
  return Number.isNaN(target) ? 0 : target - Date.now()
})()

export function now(): number {
  return Date.now() + offset
}

/** setTimeout is capped at ~24.8 days; longer waits re-check on expiry. */
export const MAX_TIMEOUT = 2_147_483_647
