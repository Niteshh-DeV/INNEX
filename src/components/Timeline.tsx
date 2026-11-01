import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { BuildClock } from "./BuildClock"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"
import { SplitHeader } from "./primitives/SplitHeader"

export function Timeline() {
  const { timeline } = useEdition()

  return (
    <section id="timeline" className="bg-bg-1 text-ink">
      <Container className="flex flex-col gap-14 py-24 lg:gap-[70px] lg:py-[150px]">
        <SplitHeader
          label={timeline.label}
          labelClassName="text-[13px] text-blue"
        >
          <div className="flex flex-col gap-[22px] [word-break:break-word]">
            <Reveal index={1}>
              <h2 className="font-ox-light text-[40px] leading-[1.125] font-light tracking-[-0.01em] md:text-[54px] lg:text-[64px] lg:leading-[72px]">
                <AccentText
                  text={timeline.heading}
                  accentClassName="text-blue"
                />
              </h2>
            </Reveal>
            <Reveal index={2}>
              <p className="max-w-[620px] font-exo text-[17px] leading-[28px] font-normal">
                {timeline.intro}
              </p>
            </Reveal>
          </div>
        </SplitHeader>

        <div className="flex w-full flex-col gap-10">
        <BuildClock label={timeline.clock.label} hours={timeline.clock.hours} />
        <ol className="flex w-full flex-col border-y border-ink [word-break:break-word] md:flex-row">
          {timeline.days.map((day, index) => (
            <li
              key={day.label}
              className={cn(
                "pt-11 pb-12 md:min-w-0 md:flex-1 md:pr-9",
                index > 0 &&
                  "border-t border-ink md:border-t-0 md:border-l md:pl-9",
              )}
            >
              <Reveal index={index} className="flex flex-col items-start gap-4">
                <MonoLabel className="text-[13px] text-blue">
                  {day.label}
                </MonoLabel>
                <h3 className="font-ox-medium text-[32px] leading-[1.16] font-medium whitespace-nowrap lg:text-[38px] lg:leading-[44px]">
                  {day.title}
                </h3>
                <p className="font-exo text-[15px] leading-[25px] font-normal">
                  {day.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
        </div>
      </Container>
    </section>
  )
}
