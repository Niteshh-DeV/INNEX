import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"
import { registerLenis, scrollToHash } from "@/lib/scroll"
import { useSectionsReady } from "@/lib/sections-ready"

/**
 * Lenis smooth scrolling for mouse/trackpad users only (touch devices keep native
 * scrolling and skip the per-frame loop), plus deep-link support for `/#faq` URLs.
 */
export function SmoothScroll() {
  const sectionsReady = useSectionsReady()

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const lenis = reduce || !finePointer ? null : new Lenis({ autoRaf: true, lerp: 0.1 })
    registerLenis(lenis)
    return () => {
      registerLenis(null)
      lenis?.destroy()
    }
  }, [])

  // Honour a hash in the initial URL once its section exists and fonts have settled the layout.
  useEffect(() => {
    const { hash } = window.location
    if (!sectionsReady || hash.length <= 1) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) scrollToHash(hash)
    })
    return () => {
      cancelled = true
    }
  }, [sectionsReady])

  return null
}
