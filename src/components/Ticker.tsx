import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"
import { useRef } from "react"
import { useEdition } from "@/lib/edition-context"

/** Base drift in % of the doubled track per second (one copy = 50%). */
const BASE_SPEED = 1.1

function wrap(min: number, max: number, value: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/** Amber marquee that speeds up with scroll velocity and flips direction when scrolling up. */
export function Ticker() {
  const { ticker } = useEdition()
  const line = `${ticker.join("   //   ")}   //   `
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // Skip per-frame work entirely while the ticker is off screen.
  const inView = useInView(ref)

  const offset = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const direction = useRef(-1)
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const currentBoost = boost.get()
    if (currentBoost < 0) direction.current = 1
    else if (currentBoost > 0) direction.current = -1
    const step = direction.current * BASE_SPEED * (delta / 1000)
    offset.set(offset.get() + step + step * Math.abs(currentBoost))
  })

  return (
    <div
      ref={ref}
      className="flex items-center overflow-hidden bg-amber py-[18px]"
      role="marquee"
      aria-label={ticker.join(", ")}
    >
      <m.div className="flex w-max" style={{ x }} aria-hidden="true">
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="shrink-0 font-mono text-[14px] leading-[normal] tracking-[0.16em] whitespace-pre text-ink"
          >
            {line}
          </p>
        ))}
      </m.div>
    </div>
  )
}
