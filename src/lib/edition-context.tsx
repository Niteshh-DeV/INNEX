import { createContext, useContext, type ReactNode } from "react"
import type { Edition } from "@content/types"

const EditionContext = createContext<Edition | null>(null)

export function EditionProvider({
  edition,
  children,
}: {
  edition: Edition
  children: ReactNode
}) {
  return (
    <EditionContext.Provider value={edition}>
      {children}
    </EditionContext.Provider>
  )
}

export function useEdition(): Edition {
  const edition = useContext(EditionContext)
  if (!edition)
    throw new Error("useEdition must be used inside <EditionProvider>")
  return edition
}
