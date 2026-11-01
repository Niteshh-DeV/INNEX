import { Fragment } from "react"
import { useEdition } from "@/lib/edition-context"
import { Container } from "./primitives/Container"
import { MonoLabel } from "./primitives/MonoLabel"
import { Wordmark } from "./Wordmark"

const LINK = "transition-colors duration-[400ms] hover:text-amber focus-visible:text-amber"

export function Footer() {
  const { footer, version, year, organizer } = useEdition()
  const { contact, credit } = footer

  return (
    <footer className="border-t border-white bg-ink text-white">
      <Container className="flex flex-col gap-10 py-16 [word-break:break-word] md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-[480px] flex-col items-start gap-3">
          <div className="flex items-end gap-3">
            <Wordmark className="h-[24px]" />
            <span className="font-orbitron-bold text-[30px] leading-[24px] font-bold">
              {version}
            </span>
          </div>
          <p className="font-exo text-[15px] leading-[normal] font-normal">
            {footer.tagline}
          </p>
          <p className="font-exo text-[13px] leading-[20px] font-normal">
            {footer.address}
          </p>
        </div>
        <div className="flex flex-col items-start gap-[10px] leading-[normal]">
          <MonoLabel className="text-[12px] text-amber">
            {footer.contactLabel}
          </MonoLabel>
          <p className="font-exo text-[15px] font-normal whitespace-pre-wrap">
            <a href={`mailto:${contact.email}`} className={LINK}>
              {contact.email}
            </a>
            {"   ·   "}
            <a href={contact.phoneHref} className={LINK}>
              {contact.phone}
            </a>
          </p>
          <p className="font-exo text-[15px] font-normal whitespace-pre-wrap">
            {footer.socials.map((social, index) => (
              <Fragment key={social.label}>
                {index > 0 && "  ·  "}
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    {social.label}
                  </a>
                ) : (
                  social.label
                )}
              </Fragment>
            ))}
          </p>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-white/20 py-6 font-mono text-[11px] leading-[normal] tracking-[0.16em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>{`© ${year} ${organizer.short}`}</p>
        <p>
          {`${credit.label.toUpperCase()} `}
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white underline decoration-white/40 underline-offset-4 ${LINK}`}
          >
            {credit.name.toUpperCase()}
          </a>
        </p>
      </Container>
    </footer>
  )
}
