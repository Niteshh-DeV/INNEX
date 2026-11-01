import type { AccentText as AccentTextValue } from "@content/types"

/** Renders `lead` + highlighted `accent` + optional `trail` as inline spans. */
export function AccentText({
  text,
  accentClassName,
}: {
  text: AccentTextValue
  accentClassName: string
}) {
  return (
    <>
      <span>{text.lead}</span>
      <span className={accentClassName}>{text.accent}</span>
      {text.trail && <span>{text.trail}</span>}
    </>
  )
}
