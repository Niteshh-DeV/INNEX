import { useEdition } from "@/lib/edition-context"

/** schema.org Event structured data for the active edition. */
export function EventJsonLd() {
  const edition = useEdition()
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${edition.name} — ${edition.motto}`,
    description: edition.hero.sub,
    startDate: edition.dates.startISO,
    endDate: edition.dates.endISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: edition.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: edition.venue.address,
        addressCountry: "NP",
      },
    },
    organizer: {
      "@type": "Organization",
      name: edition.organizer.full,
      alternateName: edition.organizer.short,
      email: edition.footer.contact.email,
      telephone: edition.footer.contact.phone,
      sameAs: edition.footer.socials.flatMap((social) => (social.href ? [social.href] : [])),
    },
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
