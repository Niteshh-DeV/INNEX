import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useEffect, useRef } from "react"

const assetPathPrefix = "/assets"

/** Layer boxes as positioned in the Figma frame (top right bottom left, % of the 1440×439 frame). */
const LAYER_INSETS = [
  "9.3% -1.5% -5.24% 0",
  "25.4% 63.83% 54.42% 23.26%",
  "33.02% -0.43% -2.01% 0.14%",
  "33.25% 0 -0.47% 0.14%",
]

const LAYERS = {
  /** Full-colour illustration for the Location section. */
  full: ["ca37e.svg", "4d06d.svg", "affaf.svg", "0799e.svg"],
  /** 7% white echo behind the hero. */
  echo: ["88134.svg", "eaa70.svg", "6aec9.svg", "080ac.svg"],
}

/** Back-to-front depth of each layer for the echo parallax. */
const DEPTH = [0.2, 0.45, 0.7, 1]

function LayerImage({ file, index }: { file: string; index: number }) {
  return (
    <div className="absolute" style={{ inset: LAYER_INSETS[index] }}>
      <img alt="" src={`${assetPathPrefix}/${file}`} className="absolute inset-0 block size-full max-w-none" />
    </div>
  )
}

function DepthLayer({
  file,
  index,
  pointerX,
  pointerY,
  scrollY,
}: {
  file: string
  index: number
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  scrollY: MotionValue<number>
}) {
  const depth = DEPTH[index]
  const x = useTransform(pointerX, (v) => v * depth * 22)
  const y = useTransform(() => scrollY.get() * depth * 0.18 + pointerY.get() * depth * 10)
  return (
    // Slight overscale so shifting layers never expose an edge.
    <m.div className="absolute inset-0 scale-[1.04]" style={{ x, y }}>
      <LayerImage file={file} index={index} />
    </m.div>
  )
}

/** Hero echo: layers separate in depth with scroll and (on mouse devices) the cursor. */
function EchoLayers() {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 60, damping: 20 })
  const pointerY = useSpring(rawY, { stiffness: 60, damping: 20 })
  const { scrollY } = useScroll()

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [rawX, rawY])

  return LAYERS.echo.map((file, index) => (
    <DepthLayer
      key={file}
      file={file}
      index={index}
      pointerX={pointerX}
      pointerY={pointerY}
      scrollY={scrollY}
    />
  ))
}

/** Location illustration: drifts gently with its own scroll progress. */
function FullLayers() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  // Gentle drift (well under 0.3× scroll); pushes downward so no gap opens at the base.
  const drift = useTransform(scrollYProgress, [0, 1], [0, 18])
  return (
    <m.div ref={ref} className="absolute inset-0" style={{ y: drift }}>
      {LAYERS.full.map((file, index) => (
        <LayerImage key={file} file={file} index={index} />
      ))}
    </m.div>
  )
}

export function SudurpashchimIllustration({ variant }: { variant: keyof typeof LAYERS }) {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden="true" className="relative aspect-[1440/439.149] w-full overflow-hidden">
      {reduce ? (
        LAYERS[variant].map((file, index) => <LayerImage key={file} file={file} index={index} />)
      ) : variant === "echo" ? (
        <EchoLayers />
      ) : (
        <FullLayers />
      )}
    </div>
  )
}
