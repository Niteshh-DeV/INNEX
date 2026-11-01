import type { ComponentPropsWithRef, MouseEvent } from "react"
import { scrollToHash } from "@/lib/scroll"

/** Anchor that smooth-scrolls in-page hashes and opens external URLs in a new tab. */
export function SmartLink({ href, onClick, ...props }: ComponentPropsWithRef<"a"> & { href: string }) {
  const external = /^https?:/.test(href)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || !href.startsWith("#")) return
    event.preventDefault()
    scrollToHash(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  )
}
