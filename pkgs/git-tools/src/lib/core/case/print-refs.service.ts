import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { Literal as LogLevelLiteral } from "effect/LogLevel"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	level: Exclude<LogLevelLiteral, "None" | "All">
	message: string
}

/**
 * Reference service
 */
class PrintRefs extends Tag(`${SERVICE_PREFIX}/case/print-refs`)<
	PrintRefs,
	(args: Arguments) => Effect<void>
>() {}

export default PrintRefs
export type { Arguments }
