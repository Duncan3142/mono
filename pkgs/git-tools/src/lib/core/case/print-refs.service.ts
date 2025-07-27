import type { Effect, LogLevel } from "effect"
import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	level: Exclude<LogLevel.Literal, "None" | "All">
	message: string
}

/**
 * Reference service
 */
class PrintRefs extends Context.Tag(`${SERVICE_PREFIX}/case/print-refs`)<
	PrintRefs,
	(args: Arguments) => Effect.Effect<void>
>() {}

export default PrintRefs
export type { Arguments }
