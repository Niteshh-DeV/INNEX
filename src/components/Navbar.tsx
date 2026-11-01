import { useEffect, useState, type MouseEvent } from "react"
import { useEdition } from "@/lib/edition-context"
import { cn } from "@/lib/cn"
import { useRegistration } from "@/lib/registration"
import { scrollToHash } from "@/lib/scroll"
import { useSectionsReady } from "@/lib/sections-ready"
import { Button } from "./primitives/Button"
import { ScrambleText } from "./primitives/ScrambleText"
import { Wordmark } from "./Wordmark"

/** Tracks which nav section currently sits under the reading line (just below the navbar). */
function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = hrefs.join(",")
  // Sections below the hero mount lazily; re-collect them once they exist.
  const sectionsReady = useSectionsReady()

  useEffect(() => {
    const sections = key
      .split(",")
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => el !== null)
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(`#${entry.target.id}`)
          else visible.delete(`#${entry.target.id}`)
        }
        setActive(key.split(",").find((href) => visible.has(href)) ?? null)
      },
      { rootMargin: "-30% 0px -65% 0px" },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key, sectionsReady])

  return active
}

function DesktopNavLink({
  label,
  href,
  active,
  onNavigate,
}: {
  label: string
  href: string
  active: boolean
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  const [replay, setReplay] = useState(0)
  const decode = () => setReplay((count) => count + 1)

  return (
    <a
      href={href}
      onClick={(event) => onNavigate(event, href)}
      onPointerEnter={decode}
      onFocus={decode}
      aria-current={active ? "location" : undefined}
      className="group flex flex-col items-start gap-2 py-1"
    >
      <ScrambleText
        text={label}
        onView={false}
        replay={replay}
        className="font-mono text-[12px] leading-[normal] tracking-[0.16em] whitespace-nowrap text-white transition-colors duration-[400ms] group-hover:text-amber"
      />
      <span
        className={cn(
          "h-px bg-amber transition-[width] duration-[400ms] ease-out group-hover:w-full group-focus-visible:w-full",
          active ? "w-full" : "w-[18px]",
        )}
      />
    </a>
  )
}

export function Navbar() {
  const edition = useEdition()
  const [open, setOpen] = useState(false)
  const registration = useRegistration()
  const active = useActiveSection(edition.nav.links.map((link) => link.href))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  function go(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    setOpen(false)
    scrollToHash(href)
  }

  return (
    <header
      data-navbar
      className="fixed inset-x-0 top-0 z-50 border-b border-white bg-ink"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-6 py-4 md:px-10 lg:px-20 lg:py-5"
      >
        <a
          href="#top"
          onClick={(event) => go(event, "#top")}
          className="flex flex-col items-start gap-[6px] text-white"
        >
          <Wordmark className="h-[18px] lg:h-[22px]" />
          <span className="font-mono text-[9px] leading-[normal] tracking-[0.2em] whitespace-nowrap sm:tracking-[0.3em]">
            {edition.motto.toUpperCase()}
          </span>
        </a>

        <ul className="hidden items-center gap-10 lg:flex">
          {edition.nav.links.map((link) => (
            <li key={link.href}>
              <DesktopNavLink
                label={link.label}
                href={link.href}
                active={active === link.href}
                onNavigate={go}
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 lg:gap-5">
          <Button
            variant="gold"
            href={registration.href}
            className="max-sm:px-4 max-sm:py-3"
          >
            {registration.open
              ? edition.nav.register
              : edition.registrationClosed.nav}
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="font-mono text-[12px] leading-[normal] tracking-[0.16em] text-white lg:hidden"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden border-white transition-[grid-template-rows,border-color] duration-[400ms] ease-out lg:hidden",
          open
            ? "grid-rows-[1fr] border-t"
            : "grid-rows-[0fr] border-t border-transparent",
        )}
      >
        <ul className="min-h-0 px-6 md:px-10">
          {edition.nav.links.map((link, index) => (
            <li
              key={link.href}
              className={cn(index > 0 && "border-t border-white/20")}
            >
              <a
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={(event) => go(event, link.href)}
                aria-current={active === link.href ? "location" : undefined}
                className="flex items-center justify-between py-5 font-mono text-[13px] tracking-[0.16em] text-white aria-[current=location]:text-amber"
              >
                {link.label}
                <span className="text-amber">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
