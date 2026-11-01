/**
 * One shared IntersectionObserver for every `.reveal` element: adds `is-visible`
 * the first time an element enters the viewport, then stops watching it.
 */
let observer: IntersectionObserver | null = null

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("is-visible")
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  )
  return observer
}

export function observeReveal(element: Element): () => void {
  const io = getObserver()
  io.observe(element)
  return () => io.unobserve(element)
}
