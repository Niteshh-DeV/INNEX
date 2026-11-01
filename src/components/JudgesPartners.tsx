import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { AccentText } from "./primitives/AccentText"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Reveal } from "./primitives/Reveal"
import { SplitHeader } from "./primitives/SplitHeader"

const assetPathPrefix = "/assets"

const CORNER_MARKS = [
  {
    src: `${assetPathPrefix}/08816.svg`,
    position: "left-[14px] top-[14px] group-hover:translate-x-1.5 group-hover:translate-y-1.5",
    inset: "-4.69% 0 0 -4.69%",
  },
  {
    src: `${assetPathPrefix}/3c9fa.svg`,
    position: "right-[14px] top-[14px] group-hover:-translate-x-1.5 group-hover:translate-y-1.5",
    inset: "-4.69% -4.69% 0 0",
  },
  {
    src: `${assetPathPrefix}/2d7e3.svg`,
    position: "left-[14px] bottom-[14px] group-hover:translate-x-1.5 group-hover:-translate-y-1.5",
    inset: "0 0 -4.69% -4.69%",
  },
  {
    src: `${assetPathPrefix}/0f316.svg`,
    position: "right-[14px] bottom-[14px] group-hover:-translate-x-1.5 group-hover:-translate-y-1.5",
    inset: "0 -4.69% -4.69% 0",
  },
]

function PortraitSlot({
  name,
  photo,
  placeholder,
}: {
  name: string | null
  photo: string | null
  placeholder: string
}) {
  return (
    <figure className="group flex min-w-0 flex-col items-start gap-3">
      <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-lavender">
        {photo ? (
          <img
            src={photo}
            alt={name ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <p className="font-mono text-[11px] leading-[normal] tracking-[0.16em] whitespace-nowrap">
            PORTRAIT
          </p>
        )}
        {CORNER_MARKS.map((mark) => (
          <div
            key={mark.src}
            className={cn(
              "absolute size-4 transition-transform duration-500 ease-out",
              mark.position,
            )}
            aria-hidden="true"
          >
            <div className="absolute" style={{ inset: mark.inset }}>
              <img
                alt=""
                src={mark.src}
                className="block size-full max-w-none"
              />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="font-mono text-[11px] leading-[normal] tracking-[0.16em]">
        {name ?? placeholder}
      </figcaption>
    </figure>
  )
}

export function JudgesPartners() {
  const { judges, partners, footer, name } = useEdition()

  return (
    <section id="judges" className="bg-bg-1 text-ink">
      <Container className="flex flex-col gap-20 py-24 lg:gap-[90px] lg:py-[150px]">
        <SplitHeader
          label={judges.label}
          labelClassName="text-[13px] text-blue"
        >
          <div className="flex flex-col gap-9">
            <Reveal index={1}>
              <h2 className="font-ox-light text-[40px] leading-[1.14] font-light tracking-[-0.01em] [word-break:break-word] md:text-[48px] lg:text-[56px] lg:leading-[64px]">
                <AccentText text={judges.heading} accentClassName="text-blue" />
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {judges.people.map((person, index) => (
                <Reveal key={index} index={index}>
                  <PortraitSlot
                    name={person.name}
                    photo={person.photo}
                    placeholder={judges.placeholder}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </SplitHeader>

        <SplitHeader
          label={partners.label}
          labelClassName="text-[13px] text-blue"
        >
          <div className="flex flex-col gap-7">
            <Reveal index={1}>
              <h3 className="font-chakra text-[28px] leading-[normal]">
                {partners.heading}
              </h3>
            </Reveal>
            <Reveal index={2}>
              <ul className="grid grid-cols-2 border-y border-ink sm:grid-cols-3 lg:grid-cols-5">
                {partners.logos.map((partner, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex h-[110px] items-center justify-center border-ink transition-colors duration-[400ms] hover:bg-white",
                      "max-sm:[&:nth-child(2n)]:border-l max-sm:[&:nth-child(n+3)]:border-t",
                      "sm:max-lg:[&:not(:nth-child(3n+1))]:border-l sm:max-lg:[&:nth-child(n+4)]:border-t",
                      "lg:[&:not(:first-child)]:border-l",
                    )}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name ?? ""}
                        className="max-h-12 max-w-[70%] object-contain"
                      />
                    ) : (
                      <p className="font-mono text-[11px] leading-[normal] tracking-[0.16em] whitespace-nowrap">
                        {partners.placeholder}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal index={3}>
              <a
                href={`mailto:${footer.contact.email}?subject=${encodeURIComponent(`${name} partnership`)}`}
                className="group inline-flex items-center gap-2 transition-colors duration-[400ms] hover:text-blue"
              >
                <MonoLabel className="text-[11px]">{partners.note}</MonoLabel>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] transition-transform duration-[400ms] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Reveal>
          </div>
        </SplitHeader>
      </Container>
    </section>
  )
}
