import type { Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { ResetMode } from "#domain/reset"

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly mode: ResetMode
}

/**
 * Checkout command service
 */
class ResetCommandExecutor extends Context.Tag(tag(`command`, `reset-executor`))<
	ResetCommandExecutor,
	(args: Arguments) => Effect.Effect<void>
>() {}

export default ResetCommandExecutor
export type { Arguments }
