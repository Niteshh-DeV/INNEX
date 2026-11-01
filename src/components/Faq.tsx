import { useId, useState } from "react"
import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"
import { Terminal } from "./Terminal"

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(true)
  const id = useId()

  return (
    <li className="border-b border-ink">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center justify-between gap-6 pt-[26px] pb-[10px] text-left text-[20px] leading-[normal] md:text-[22px]"
        >
          <span className="font-chakra text-ink transition-colors duration-[400ms] ease-out group-hover:text-blue">
            {question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "font-mono text-amber transition-transform duration-[400ms] ease-out",
              open ? "rotate-0" : "rotate-90",
            )}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows] duration-[400ms] ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="pb-7 font-exo text-[15px] leading-[24px] font-normal text-ink">
            {answer}
          </p>
        </div>
      </div>
    </li>
  )
}

export function Faq() {
  const { faq, wordmark } = useEdition()

  return (
    <section id="faq" className="bg-bg-2 text-ink">
      <Container className="flex flex-col gap-12 py-24 [word-break:break-word] lg:flex-row lg:gap-[60px] lg:py-[150px]">
        <div className="flex flex-col gap-[22px] lg:w-[440px] lg:shrink-0">
          <Reveal>
            <MonoLabel className="text-[13px] text-blue">{faq.label}</MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <h2 className="font-ox-light text-[40px] leading-[1.14] font-light tracking-[-0.01em] md:text-[48px] lg:text-[56px] lg:leading-[64px]">
              <AccentText text={faq.heading} accentClassName="text-blue" />
            </h2>
          </Reveal>
          <Reveal index={2} className="mt-8 hidden lg:block">
            <Terminal
              title={`~/${wordmark.lead}${wordmark.accent}`.toLowerCase()}
              command={faq.terminal.command}
              lines={faq.terminal.lines}
            />
          </Reveal>
        </div>
        <Reveal index={1} className="min-w-0 flex-1">
          <ul className="border-t border-ink">
            {faq.items.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
