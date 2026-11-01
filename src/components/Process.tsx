import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useRef } from "react"
import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { EASE_LUXE } from "@/lib/motion"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { CountUp } from "./primitives/CountUp"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"
import { SplitHeader } from "./primitives/SplitHeader"

/** Amber signal that runs along a step's top rule as the pipeline scrolls into view. */
function StepSignal({
  progress,
  index,
  count,
}: {
  progress: MotionValue<number>
  index: number
  count: number
}) {
  const segments = count - 1
  const scaleX = useTransform(progress, [(index - 1) / segments, index / segments], [0, 1])
  return (
    <m.span
      aria-hidden="true"
      className="absolute -top-px left-0 h-px w-full origin-left bg-amber"
      style={{ scaleX }}
    />
  )
}

export function Process() {
  const { process } = useEdition()
  const reduce = useReducedMotion()
  const stepsRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 85%", "end 45%"],
  })

  return (
    <section id="process" className="bg-ink text-white">
      <Container className="flex flex-col gap-16 py-24 lg:gap-20 lg:py-[150px]">
        <SplitHeader
          label={process.label}
          labelClassName="text-[13px] text-amber"
        >
          <div className="flex flex-col gap-[22px] [word-break:break-word]">
            <Reveal index={1}>
              <h2 className="font-ox-light text-[40px] leading-[1.125] font-light tracking-[-0.01em] md:text-[54px] lg:text-[64px] lg:leading-[72px]">
                <AccentText
                  text={process.heading}
                  accentClassName="text-amber"
                />
              </h2>
            </Reveal>
            <Reveal index={2}>
              <p className="max-w-[620px] font-exo text-[17px] leading-[28px] font-normal">
                {process.intro}
              </p>
            </Reveal>
          </div>
        </SplitHeader>

        <ol
          ref={stepsRef}
          className="grid w-full gap-10 [word-break:break-word] sm:grid-cols-2 lg:grid-cols-4"
        >
          {process.steps.map((step, index) => (
            <li
              key={step.number}
              className={cn(
                "relative border-t pt-[30px]",
                index === 0 ? "border-amber" : "border-white",
              )}
            >
              {index > 0 && (
                <StepSignal
                  progress={scrollYProgress}
                  index={index}
                  count={process.steps.length}
                />
              )}
              <Reveal index={index} className="flex flex-col items-start gap-4">
                <p className="font-orbitron text-[48px] leading-[54px] font-normal whitespace-nowrap text-amber">
                  {step.number}
                </p>
                <h3 className="font-chakra text-[26px] leading-[normal] whitespace-nowrap">
                  {step.title}
                </h3>
                <p className="font-exo text-[15px] leading-[24px] font-normal">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="flex w-full flex-col gap-5">
          <Reveal>
            <MonoLabel className="text-[13px] text-amber">
              {process.scoringLabel}
            </MonoLabel>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-2 gap-y-8 md:flex md:gap-2">
            {process.scoring.map((segment, index) => (
              <div
                key={segment.label}
                className="flex min-w-0 flex-col items-start gap-3"
                style={{ flex: `${segment.points} 1 0%` }}
              >
                <m.div
                  className={cn(
                    "h-[3px] w-full origin-left",
                    index === 0 ? "bg-amber" : "bg-white",
                  )}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: 1.1,
                    ease: EASE_LUXE,
                    delay: index * 0.12,
                  }}
                />
                <p className="font-orbitron text-[44px] leading-[50px] font-normal whitespace-nowrap">
                  <CountUp value={String(segment.points)} />
                </p>
                <p className="font-mono text-[11px] leading-[normal] tracking-[0.16em] [word-break:break-word]">
                  {segment.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
