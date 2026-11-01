import type { Edition } from "../types"
import innex2026 from "./2026"

/** All editions, newest first. Add next year's file here and point `currentEdition` at it. */
export const editions: Edition[] = [innex2026]

export const currentEdition: Edition = innex2026
