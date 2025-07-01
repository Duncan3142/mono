import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { Arguments as PrintArguments } from "./core/print.case.ts"

/**
 * Reference service
 */
class Reference extends Tag("ReferenceService")<
	Reference,
	{
		readonly print: (args: PrintArguments) => Effect<void>
	}
>() {}

export default Reference
