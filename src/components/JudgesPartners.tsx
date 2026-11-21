import type { Edition } from "@content/types"
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

type PartnersContent = Edition["partners"]
type Partner = PartnersContent["tiers"][number]["groups"][number]["partners"][number]
type PartnerImage = NonNullable<Partner["images"]>[number]

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`

/** Amber diamond from the sponsor board header. */
function Diamond() {
  return <span aria-hidden="true" className="size-[9px] shrink-0 rotate-45 bg-amber" />
}

/** A logo at its designed size; cropped artwork is placed inside a clipping box exactly as in Figma. */
function PartnerArtwork({ image, alt }: { image: PartnerImage; alt: string }) {
  const { crop } = image
  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{ width: image.width, height: image.height }}
    >
      <img
        src={asset(image.src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute max-w-none",
          crop ? "object-cover" : "inset-0 size-full object-contain",
        )}
        style={crop && { left: crop.x, top: crop.y, width: crop.width, height: crop.height }}
      />
    </span>
  )
}

function PartnerLogo({ partner }: { partner: Partner }) {
  if (partner.wordmark) {
    return (
      <span
        className="flex flex-col items-center text-center font-poppins"
        style={{ width: partner.wordmark.width }}
      >
        {partner.wordmark.lines.map((line) => (
          <span
            key={line.text}
            className={cn(
              "block",
              line.tone === "blue" ? "text-blue" : "text-ink",
              line.weight === "extrabold" ? "font-extrabold" : "font-semibold",
            )}
            style={{
              fontSize: line.size,
              lineHeight: `${line.leading}px`,
              letterSpacing: line.tracking,
            }}
          >
            {line.text}
          </span>
        ))}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-[6px]">
      {partner.images?.map((image, index) => (
        <PartnerArtwork key={image.src} image={image} alt={index === 0 ? partner.name : ""} />
      ))}
    </span>
  )
}

/** The "IN PARTNERSHIP WITH" board: role titles over logos, headline sponsors first. */
function SponsorBoard({ partners }: { partners: PartnersContent }) {
  return (
    <div className="flex flex-col gap-10 rounded-[22px] border-2 border-lavender bg-white px-6 py-10 lg:px-10 lg:py-12">
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="h-[2px] min-w-0 flex-1 bg-linear-to-r from-blue/0 to-blue/55" />
        <Diamond />
        <h3 className="text-center font-orbitron-bold text-[13px] leading-[normal] font-bold tracking-[0.2em] text-ink sm:text-[17px] sm:tracking-[0.28em]">
          {partners.heading}
        </h3>
        <Diamond />
        <span className="h-[2px] min-w-0 flex-1 bg-linear-to-l from-blue/0 to-blue/55" />
      </div>
      {partners.tiers.map((tier, tierIndex) => {
        const large = tierIndex === 0
        return (
          <div
            key={tierIndex}
            className={cn(
              "flex flex-wrap items-start justify-center gap-x-12 gap-y-8",
              large ? "lg:gap-x-[72px]" : "border-t border-lavender pt-10",
            )}
          >
            {tier.groups.map((group) => (
              <div key={group.role} className="flex max-w-full flex-col items-center gap-[6px]">
                <p
                  className={cn(
                    "text-center font-chakra-semibold leading-[normal] text-blue",
                    large ? "text-[17px] tracking-[0.025em]" : "text-[15px] tracking-[0.06em]",
                  )}
                >
                  {group.role}
                </p>
                <ul
                  className={cn(
                    "flex flex-wrap items-center justify-center gap-y-2",
                    large ? "gap-x-3" : "gap-x-2.5",
                  )}
                >
                  {group.partners.map((partner) => (
                    <li
                      key={partner.name}
                      className="flex items-center justify-center"
                      style={{ height: tier.logoHeight }}
                    >
                      <PartnerLogo partner={partner} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function JudgesPartners() {
  const { judges, partners } = useEdition()

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

        <div id="partners" className="flex flex-col gap-8">
          <Reveal>
            <MonoLabel className="text-[13px] text-blue">{partners.label}</MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <SponsorBoard partners={partners} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
