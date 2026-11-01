/** Runs `callback` when the browser is idle (or after `timeout` ms at the latest). */
export function onIdle(callback: () => void, timeout = 1500): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  // Safari has no requestIdleCallback.
  const id = setTimeout(callback, 200)
  return () => clearTimeout(id)
}
