import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

type SectionsReady = { ready: boolean; markReady: () => void }

const SectionsReadyContext = createContext<SectionsReady>({ ready: false, markReady: () => {} })

/** Tracks whether the lazily mounted below-the-fold sections are in the DOM. */
export function SectionsReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const markReady = useCallback(() => setReady(true), [])
  const value = useMemo(() => ({ ready, markReady }), [ready, markReady])
  return <SectionsReadyContext.Provider value={value}>{children}</SectionsReadyContext.Provider>
}

/** True once every below-the-fold section has mounted. */
export function useSectionsReady(): boolean {
  return useContext(SectionsReadyContext).ready
}

/** Called by the lazy sections once they have all mounted. */
export function useMarkSectionsReady(): () => void {
  return useContext(SectionsReadyContext).markReady
}
