import type { Duration, Effect } from "effect"
import { Context } from "effect"
import type { REF_TYPE } from "#domain/reference"
import { tag } from "#const"

interface Arguments {
	readonly type: REF_TYPE
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Print refs command service
 */
class PrintRefsExecutor extends Context.Tag(tag(`executor`, `print-refs`))<
	PrintRefsExecutor,
	(args: Arguments) => Effect.Effect<void>
>() {}

export default PrintRefsExecutor
export type { Arguments }
