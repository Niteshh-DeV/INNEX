import type { CSSProperties } from "react"
import { useEdition } from "@/lib/edition-context"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"

export function Perks() {
  const { perks } = useEdition()
  // Two independent ruled columns on desktop (odd / even), one ordered list on mobile.
  const columns = [
    perks.items.filter((_, i) => i % 2 === 0),
    perks.items.filter((_, i) => i % 2 === 1),
  ]

  return (
    <section id="perks" className="bg-bg-2 text-ink">
      <Container className="flex flex-col gap-12 py-24 [word-break:break-word] lg:flex-row lg:gap-[60px] lg:py-[150px]">
        <div className="flex flex-col gap-[22px] lg:w-[440px] lg:shrink-0">
          <Reveal>
            <MonoLabel className="text-[13px] text-blue">
              {perks.label}
            </MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <h2 className="font-ox-light text-[40px] leading-[1.14] font-light tracking-[-0.01em] md:text-[48px] lg:text-[56px] lg:leading-[64px]">
              <AccentText text={perks.heading} accentClassName="text-blue" />
            </h2>
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-1 flex-col md:flex-row md:gap-12">
          {columns.map((column, columnIndex) => (
            <ul
              key={columnIndex}
              className="contents md:flex md:min-w-0 md:flex-1 md:flex-col"
            >
              {column.map((perk, rowIndex) => (
                <li
                  key={perk.number}
                  className="group relative border-t border-ink pt-[26px] pb-[34px] max-md:order-[var(--order)]"
                  style={
                    { "--order": rowIndex * 2 + columnIndex } as CSSProperties
                  }
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-amber transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  <Reveal
                    index={rowIndex}
                    className="flex flex-col items-start gap-[10px]"
                  >
                    <p className="font-mono text-[12px] leading-[normal] tracking-[0.16em] whitespace-nowrap transition-colors duration-[400ms] group-hover:text-amber">
                      {perk.number}
                    </p>
                    <h3 className="font-chakra text-[24px] leading-[normal] transition-colors duration-[400ms] group-hover:text-blue">
                      {perk.title}
                    </h3>
                    <p className="font-exo text-[15px] leading-[24px] font-normal">
                      {perk.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Container>
    </section>
  )
}
