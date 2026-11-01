import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { CountUp } from "./primitives/CountUp"
import { Reveal } from "./primitives/Reveal"
import { SplitHeader } from "./primitives/SplitHeader"

export function About() {
  const { about } = useEdition()

  return (
    <section id="about" className="bg-bg-1 text-ink">
      <Container className="flex flex-col gap-16 py-24 lg:gap-20 lg:pt-[170px] lg:pb-[150px]">
        <SplitHeader label={about.label} labelClassName="text-[12px] text-blue">
          <Reveal index={1}>
            <h2 className="font-ox-light text-[30px] leading-[1.24] font-light tracking-[-0.005em] [word-break:break-word] md:text-[40px] lg:text-[50px] lg:leading-[62px]">
              <AccentText text={about.statement} accentClassName="text-blue" />
            </h2>
          </Reveal>
        </SplitHeader>

        <div className="flex w-full gap-[60px]">
          <div className="hidden w-[240px] shrink-0 lg:block" />
          <div className="grid min-w-0 flex-1 gap-6 font-exo text-[16px] leading-[28px] font-normal md:grid-cols-2 md:gap-14">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} index={index}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <dl className="grid w-full grid-cols-2 gap-y-10 border-t border-ink [word-break:break-word] lg:flex lg:gap-y-0">
          {about.figures.map((figure, index) => (
            <Reveal
              key={figure.label}
              index={index}
              className={cn(
                "flex min-w-0 flex-col-reverse items-start justify-end gap-3 pt-9 lg:flex-1",
                index % 2 === 1 && "border-l border-ink pl-6 lg:pl-9",
                index === 2 && "lg:border-l lg:border-ink lg:pl-9",
              )}
            >
              <dt className="font-mono text-[11px] leading-[normal] tracking-[0.16em]">
                {figure.label}
              </dt>
              <dd className="font-orbitron text-[44px] leading-[1.1] font-normal tracking-[-0.01em] whitespace-nowrap md:text-[60px] md:leading-[66px]">
                <CountUp value={figure.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}
