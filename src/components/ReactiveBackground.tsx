import { useEffect, useRef } from "react"
import type { EventPhase } from "@/lib/event-phase"
import { onIdle } from "@/lib/idle"
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from "./wordmark-geometry"

const RADIUS = 190
const PUSH = 18
const BASE_ALPHA = 0.07
const FIGURE_ALPHA = 0.5
const DPR_CAP = 1.75
const LIVE_FRAME_MS = 33

type Ripple = { x: number; y: number; start: number }
type Dot = { x: number; y: number; inside: boolean; edge: boolean }

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "")
  const n = parseInt(value.length === 3 ? value.replace(/./g, "$&$&") : value, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Paints the figure (wordmark, or the edition number after the event) to fill a mask canvas. */
function paintFigure(ctx: CanvasRenderingContext2D, width: number, height: number, figure: string | null) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#fff"
  if (figure === null) {
    // Fit the wordmark to the slot, right-aligned so it sits over the registration card.
    const scale = Math.min(width / WORDMARK_VIEWBOX.width, height / WORDMARK_VIEWBOX.height)
    ctx.save()
    ctx.translate(width - WORDMARK_VIEWBOX.width * scale, (height - WORDMARK_VIEWBOX.height * scale) / 2)
    ctx.scale(scale, scale)
    ctx.translate(-WORDMARK_VIEWBOX.x, -WORDMARK_VIEWBOX.y)
    for (const d of [...WORDMARK_PATHS.lead, ...WORDMARK_PATHS.accent]) ctx.fill(new Path2D(d))
    ctx.restore()
  } else {
    ctx.font = `700 ${height * 1.15}px "Orbitron:Bold", sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillText(figure, width, height / 2 + height * 0.06)
  }
}

/**
 * Hero dot grid. The INNEX wordmark is rendered as a fine dot-matrix inside the
 * hero's `[data-figure-slot]` element (positioned by layout, clear of the copy);
 * near the cursor its edges trace in amber while the surrounding grid bends away.
 * - before: calm, animates only during interaction
 * - live:   a slow pulse sweeps the grid for the whole build window
 * - after:  the figure becomes the edition number
 * Reduced motion renders one static frame.
 */
export function ReactiveBackground({ phase, version }: { phase: EventPhase; version: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    const maskCanvas = document.createElement("canvas")
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })
    if (!canvas || !host || !ctx || !maskCtx) return

    const styles = getComputedStyle(document.documentElement)
    const blue = hexToRgb(styles.getPropertyValue("--color-blue") || "#1b6db5")
    const amber = hexToRgb(styles.getPropertyValue("--color-amber") || "#f9a53c")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const figure = phase === "after" ? version : null
    const pulsing = phase === "live" && !reduce

    let width = 0
    let height = 0
    let frame = 0
    let lastFrame = 0
    let visible = true
    let disposed = false
    let dots: Dot[] = []
    const pointer = { x: -9999, y: -9999, active: false }
    const ripples: Ripple[] = []

    function buildGrid() {
      const spacing = width < 768 ? 16 : 22
      const hostRect = host!.getBoundingClientRect()
      const slotRect = host!.querySelector<HTMLElement>("[data-figure-slot]")?.getBoundingClientRect()
      const slot =
        slotRect && slotRect.width > 0 && slotRect.height > 0
          ? {
              x: slotRect.left - hostRect.left,
              y: slotRect.top - hostRect.top,
              width: slotRect.width,
              height: slotRect.height,
            }
          : null

      dots = []
      // Background grid, leaving the slot clear for the figure.
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const inSlot =
            slot !== null &&
            x > slot.x - spacing / 2 &&
            x < slot.x + slot.width + spacing / 2 &&
            y > slot.y - spacing / 2 &&
            y < slot.y + slot.height + spacing / 2
          if (!inSlot) dots.push({ x, y, inside: false, edge: false })
        }
      }
      if (!slot) return

      // The figure: a finer dot-matrix sampled from the painted mask.
      maskCanvas.width = Math.max(1, Math.round(slot.width))
      maskCanvas.height = Math.max(1, Math.round(slot.height))
      paintFigure(maskCtx!, maskCanvas.width, maskCanvas.height, figure)
      const pixels = maskCtx!.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data
      const filled = (x: number, y: number) => {
        const px = Math.round(x)
        const py = Math.round(y)
        if (px < 0 || py < 0 || px >= maskCanvas.width || py >= maskCanvas.height) return false
        return pixels[(py * maskCanvas.width + px) * 4 + 3] > 127
      }
      const fine = Math.max(3.5, slot.height / 16)
      for (let y = fine / 2; y < slot.height; y += fine) {
        for (let x = fine / 2; x < slot.width; x += fine) {
          if (!filled(x, y)) continue
          const edge = !filled(x - fine, y) || !filled(x + fine, y) || !filled(x, y - fine) || !filled(x, y + fine)
          dots.push({ x: slot.x + x, y: slot.y + y, inside: true, edge })
        }
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      width = host!.clientWidth
      height = host!.clientHeight
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid()
      // Keep a correct static frame on screen whether or not the loop is running.
      draw(performance.now())
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)
      const t = time / 1000
      for (const dot of dots) {
        let x = dot.x
        let y = dot.y
        let energy = 0

        if (pointer.active) {
          const dx = dot.x - pointer.x
          const dy = dot.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < RADIUS && dist > 0.01) {
            const force = (1 - dist / RADIUS) ** 2
            // The figure holds its shape; only the surrounding grid bends.
            const push = dot.inside ? PUSH * 0.2 : PUSH
            x += (dx / dist) * force * push
            y += (dy / dist) * force * push
            energy = dot.edge ? Math.min(1, force * 1.8) : dot.inside ? force * 1.1 : force * 0.55
          }
        }

        for (const ripple of ripples) {
          const age = (time - ripple.start) / 1000
          const dx = dot.x - ripple.x
          const dy = dot.y - ripple.y
          const dist = Math.hypot(dx, dy)
          const band = 1 - Math.abs(dist - age * 520) / 60
          if (band > 0 && dist > 0.01) {
            const force = band * Math.max(0, 1 - age / 1.4)
            x += (dx / dist) * force * 10
            y += (dy / dist) * force * 10
            energy = Math.max(energy, force * 0.8)
          }
        }

        let alpha = dot.edge ? FIGURE_ALPHA + 0.08 : dot.inside ? FIGURE_ALPHA : BASE_ALPHA
        if (pulsing) {
          // A soft diagonal band sweeping the grid: the event is live.
          const wave = Math.max(0, Math.sin(dot.x * 0.01 + dot.y * 0.005 - t * 1.4)) ** 6
          alpha += wave * (dot.inside ? 0.28 : 0.12)
          energy = Math.max(energy, dot.inside ? wave * 0.6 : 0)
        }

        if (energy > 0) {
          const mix = dot.inside ? 1 : energy
          const r = Math.round(blue[0] + (amber[0] - blue[0]) * mix)
          const g = Math.round(blue[1] + (amber[1] - blue[1]) * mix)
          const b = Math.round(blue[2] + (amber[2] - blue[2]) * mix)
          ctx!.fillStyle = `rgba(${r},${g},${b},${Math.min(1, alpha + energy * 0.8)})`
        } else {
          ctx!.fillStyle = `rgba(255,255,255,${alpha})`
        }
        const size = dot.inside ? 1.8 + energy * 0.8 : 1.5 + energy * 1.3
        ctx!.fillRect(x - size / 2, y - size / 2, size, size)
      }
    }

    function loop(time: number) {
      frame = 0
      while (ripples.length && time - ripples[0].start > 1600) ripples.shift()
      const busy = pointer.active || ripples.length > 0
      if (!busy && pulsing && time - lastFrame < LIVE_FRAME_MS) {
        frame = requestAnimationFrame(loop)
        return
      }
      lastFrame = time
      draw(time)
      // Go idle once interaction ends (unless the event is live); the last frame is the static grid.
      if (visible && (busy || pulsing)) frame = requestAnimationFrame(loop)
    }

    function start() {
      if (!reduce && visible && !frame && !disposed) frame = requestAnimationFrame(loop)
    }

    function localPoint(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    function onMove(event: PointerEvent) {
      const p = localPoint(event)
      pointer.x = p.x
      pointer.y = p.y
      pointer.active = p.y >= 0 && p.y <= height
      if (pointer.active) start()
    }
    function onLeave() {
      pointer.active = false
    }
    function onDown(event: PointerEvent) {
      const p = localPoint(event)
      if (p.y >= 0 && p.y <= height) ripples.push({ ...p, start: performance.now() })
      start()
    }

    let resizeObserver: ResizeObserver | null = null
    let intersection: IntersectionObserver | null = null

    // The canvas is decoration: build it only once the browser is idle so it
    // never competes with the first render.
    const cancelIdle = onIdle(() => {
      if (disposed) return
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)
      intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      })
      intersection.observe(host)

      // The "1.0" figure needs Orbitron loaded before it can be rasterised.
      if (figure !== null) {
        document.fonts.load(`700 100px "Orbitron:Bold"`).then(() => {
          if (!disposed && width > 0) resize()
        })
      }

      if (!reduce) {
        host.addEventListener("pointermove", onMove)
        host.addEventListener("pointerleave", onLeave)
        host.addEventListener("pointerdown", onDown)
      }
      canvas.style.opacity = "1"
      start()
    }, 2000)

    return () => {
      disposed = true
      cancelIdle()
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      intersection?.disconnect()
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
      host.removeEventListener("pointerdown", onDown)
    }
  }, [phase, version])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-1000"
    />
  )
}
