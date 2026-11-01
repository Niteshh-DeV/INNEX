import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { Reveal } from "./primitives/Reveal"
import { SplitHeader } from "./primitives/SplitHeader"
import { SudurpashchimIllustration } from "./SudurpashchimIllustration"

export function Location() {
  const { location } = useEdition()

  return (
    <section
      id="location"
      className="overflow-hidden bg-white pt-24 text-ink lg:pt-[150px]"
    >
      <Container className="flex flex-col gap-14 pb-14 lg:pb-[70px]">
        <SplitHeader
          label={location.label}
          labelClassName="text-[13px] text-blue"
        >
          <Reveal index={1}>
            <h2 className="font-ox-light text-[40px] leading-[1.12] font-light tracking-[-0.01em] [word-break:break-word] md:text-[56px] lg:text-[68px] lg:leading-[76px]">
              <AccentText text={location.heading} accentClassName="text-blue" />
            </h2>
          </Reveal>
        </SplitHeader>

        <div className="flex w-full gap-[60px]">
          <div className="hidden w-[240px] shrink-0 lg:block" />
          <Reveal index={2} className="min-w-0 flex-1">
            <dl className="grid grid-cols-2 border-y border-ink [word-break:break-word] md:flex">
              {location.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={cn(
                    "flex min-w-0 flex-col gap-2 py-[22px] pr-5 md:flex-1",
                    index === 0 && "md:pr-0",
                    index % 2 === 1 && "border-l border-ink pl-5",
                    index === 2 && "md:border-l md:border-ink md:pl-5",
                    index >= 2 && "max-md:border-t max-md:border-ink",
                  )}
                >
                  <dt className="font-mono text-[11px] leading-[normal] tracking-[0.16em] whitespace-nowrap text-blue">
                    {fact.label}
                  </dt>
                  <dd className="font-exo-medium text-[15px] leading-[22px] font-medium whitespace-pre-wrap">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>

      <SudurpashchimIllustration variant="full" />
    </section>
  )
}
