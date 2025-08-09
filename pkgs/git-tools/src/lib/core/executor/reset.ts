import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Reference, GitCommandError } from "#domain"
import * as Const from "#const"
import * as Mode from "./reset.mode.ts"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode: Mode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `reset`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode }
export type { Arguments }
