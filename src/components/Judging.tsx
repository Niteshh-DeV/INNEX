import { m, useReducedMotion } from "motion/react"
import { useEdition } from "@/lib/edition-context"
import { EASE_LUXE } from "@/lib/motion"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { CountUp } from "./primitives/CountUp"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"

/** In the design the top criterion's bar spans 760 of the 780px track. */
const MAX_FILL = 760 / 780

export function Judging() {
  const { judging } = useEdition()
  const reduce = useReducedMotion()
  const maxPercent = Math.max(
    ...judging.criteria.map((criterion) => criterion.percent),
  )

  return (
    <section id="judging" className="bg-bg-1 text-ink">
      <Container className="flex flex-col gap-12 py-24 lg:flex-row lg:gap-[60px] lg:py-[150px]">
        <div className="flex flex-col gap-[22px] [word-break:break-word] lg:w-[440px] lg:shrink-0">
          <Reveal>
            <MonoLabel className="text-[13px] text-blue">
              {judging.label}
            </MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <h2 className="font-ox-light text-[40px] leading-[1.14] font-light tracking-[-0.01em] md:text-[48px] lg:text-[56px] lg:leading-[64px]">
              <AccentText text={judging.heading} accentClassName="text-blue" />
            </h2>
          </Reveal>
          <Reveal index={2}>
            <p className="font-exo text-[16px] leading-[27px] font-normal">
              {judging.intro}
            </p>
          </Reveal>
        </div>

        <ul className="min-w-0 flex-1 border-t border-ink">
          {judging.criteria.map((criterion, index) => (
            <li
              key={criterion.label}
              className="flex flex-col gap-[14px] border-b border-ink py-6"
            >
              <div className="flex items-center justify-between gap-6 leading-[normal]">
                <p className="font-exo-medium text-[16px] font-medium md:text-[17px]">
                  {criterion.label}
                </p>
                <p className="font-orbitron text-[26px] font-normal whitespace-nowrap">
                  <CountUp value={`${criterion.percent}%`} />
                </p>
              </div>
              <div className="flex h-[2px] w-full bg-ink">
                <m.div
                  className="h-[2px] origin-left bg-amber"
                  style={{
                    width: `${(criterion.percent / maxPercent) * MAX_FILL * 100}%`,
                  }}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: 1.2,
                    ease: EASE_LUXE,
                    delay: index * 0.08,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
