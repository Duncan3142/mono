import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { Literal as LogLevelLiteral } from "effect/LogLevel"

interface PrintArguments {
	level: LogLevelLiteral
	message: string
	repoDirectory: string
}

/**
 * Reference service
 */
class Reference extends Tag("ReferenceService")<
	Reference,
	{
		readonly print: (args: PrintArguments) => Effect<void, never, CommandExecutor>
	}
>() {}

/**
 * Shape of the Reference service
 */
type ReferenceShape = Tag.Service<Reference>

export type { PrintArguments, ReferenceShape }
export default Reference
