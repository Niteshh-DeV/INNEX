import { currentEdition, editions } from "@content/editions"
import type { Edition } from "@content/types"

export function getEditionByYear(year: number): Edition | undefined {
  return editions.find((edition) => edition.year === year)
}

/** `/` renders the current edition; `/2026` renders an archived one. */
export function resolveEditionFromPath(pathname: string): Edition {
  const match = pathname.match(/^\/(\d{4})\/?$/)
  return (match && getEditionByYear(Number(match[1]))) || currentEdition
}
