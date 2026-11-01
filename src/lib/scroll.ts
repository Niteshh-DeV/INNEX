import type Lenis from "lenis"

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

function navOffset(): number {
  return document.querySelector<HTMLElement>("[data-navbar]")?.offsetHeight ?? 0
}

/** Smooth-scrolls to an in-page hash such as `#tracks`, clearing the fixed navbar. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, { offset: -navOffset(), duration: 1.2 })
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const top =
      target.getBoundingClientRect().top + window.scrollY - navOffset()
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
  }
  history.replaceState(null, "", hash)
}
