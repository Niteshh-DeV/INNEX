import { domAnimation, LazyMotion, MotionConfig } from "motion/react"
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { BootLoader, isBooting } from "./components/BootLoader"
import { EventJsonLd } from "./components/EventJsonLd"
import { Hero } from "./components/Hero"
import { Navbar } from "./components/Navbar"
import { ScrollProgress } from "./components/ScrollProgress"
import { SmoothScroll } from "./components/SmoothScroll"
import { Ticker } from "./components/Ticker"
import { EditionProvider } from "./lib/edition-context"
import { resolveEditionFromPath } from "./lib/editions"
import { onIdle } from "./lib/idle"
import { SectionsReadyProvider } from "./lib/sections-ready"

const BelowFold = lazy(() => import("./components/BelowFold"))
const Footer = lazy(() => import("./components/BelowFold").then((module) => ({ default: module.Footer })))

export default function App() {
  const edition = useMemo(() => resolveEditionFromPath(window.location.pathname), [])
  // The hero renders first; the rest of the page mounts once the browser is idle
  // (immediately when arriving on a deep link like /#faq).
  const [mountRest, setMountRest] = useState(() => window.location.hash.length > 1)
  const [booting, setBooting] = useState(isBooting)
  const finishBoot = useCallback(() => setBooting(false), [])

  useEffect(() => {
    document.title = `${edition.name} — ${edition.motto}`
  }, [edition])

  useEffect(() => {
    if (mountRest) return
    return onIdle(() => setMountRest(true))
  }, [mountRest])

  return (
    <EditionProvider edition={edition}>
      <SectionsReadyProvider>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            {booting && <BootLoader onDone={finishBoot} />}
            <SmoothScroll />
            <ScrollProgress />
            <a
              href="#main"
              className="sr-only z-[70] bg-amber px-4 py-3 font-mono text-[12px] tracking-[0.16em] text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              SKIP TO CONTENT
            </a>
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              <Hero />
              <Ticker />
              {mountRest && (
                <Suspense fallback={null}>
                  <BelowFold />
                </Suspense>
              )}
            </main>
            {mountRest && (
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
            )}
            <EventJsonLd />
          </MotionConfig>
        </LazyMotion>
      </SectionsReadyProvider>
    </EditionProvider>
  )
}
