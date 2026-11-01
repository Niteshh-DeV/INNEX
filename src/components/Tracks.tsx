import { useState } from "react"
import { useEdition } from "@/lib/edition-context"
import { useRegistration } from "@/lib/registration"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { Reveal } from "./primitives/Reveal"
import { ScrambleText } from "./primitives/ScrambleText"
import { SmartLink } from "./primitives/SmartLink"
import { SplitHeader } from "./primitives/SplitHeader"

const ROW_CLASS =
  "grid grid-cols-[48px_1fr_auto] items-center gap-x-4 gap-y-2 py-6 transition-[padding] duration-[400ms] ease-out group-hover:pl-5 md:py-[30px] lg:flex lg:gap-0"

/** One editorial track row; links to registration while it is open. */
function TrackRow({
  number,
  name,
  description,
  href,
}: {
  number: string
  name: string
  description: string
  href: string | null
}) {
  const [replay, setReplay] = useState(0)
  const decode = () => setReplay((count) => count + 1)
  const content = (
    <>
      <p className="font-mono text-[13px] leading-[normal] tracking-[0.1em] transition-colors duration-[400ms] group-hover:text-amber lg:w-24 lg:shrink-0">
        <ScrambleText text={number} onView={false} replay={replay} />
      </p>
      <h3 className="font-chakra text-[22px] leading-[normal] transition-colors duration-[400ms] ease-out group-hover:text-blue md:text-[30px] lg:w-[470px] lg:shrink-0">
        {name}
      </h3>
      <p
        className="font-mono text-[18px] leading-[normal] font-normal whitespace-nowrap transition-[color,transform] duration-[400ms] ease-out group-hover:translate-x-1 group-hover:text-amber lg:order-last"
        style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        aria-hidden="true"
      >
        →
      </p>
      <p className="col-start-2 col-end-4 font-exo text-[15px] leading-[24px] font-normal lg:min-w-0 lg:flex-1 lg:pr-6">
        {description}
      </p>
    </>
  )

  return href ? (
    <SmartLink href={href} className={ROW_CLASS} onPointerEnter={decode} onFocus={decode}>
      {content}
    </SmartLink>
  ) : (
    <div className={ROW_CLASS} onPointerEnter={decode}>
      {content}
    </div>
  )
}

export function Tracks() {
  const { tracks } = useEdition()
  const registration = useRegistration()

  return (
    <section id="tracks" className="bg-bg-2 text-ink">
      <Container className="flex flex-col gap-14 py-24 lg:gap-[70px] lg:py-[150px]">
        <SplitHeader
          label={tracks.label}
          labelClassName="text-[12px] text-blue"
        >
          <div className="flex flex-col gap-[22px] [word-break:break-word]">
            <Reveal index={1}>
              <h2 className="font-ox-light text-[40px] leading-[1.09] font-light tracking-[-0.01em] md:text-[56px] lg:text-[68px] lg:leading-[74px]">
                <AccentText text={tracks.heading} accentClassName="text-blue" />
              </h2>
            </Reveal>
            <Reveal index={2}>
              <p className="max-w-[620px] font-exo text-[17px] leading-[28px] font-normal">
                {tracks.intro}
              </p>
            </Reveal>
          </div>
        </SplitHeader>

        <ol className="w-full border-t border-ink [word-break:break-word]">
          {tracks.items.map((track, index) => (
            <li
              key={track.name}
              className="group relative border-b border-ink transition-colors duration-[400ms] ease-out hover:bg-white/70"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-amber transition-transform duration-[400ms] ease-out group-hover:scale-y-100"
              />
              <Reveal index={index % 4}>
                <TrackRow
                  number={String(index + 1).padStart(2, "0")}
                  name={track.name}
                  description={track.description}
                  href={registration.open ? registration.href : null}
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
