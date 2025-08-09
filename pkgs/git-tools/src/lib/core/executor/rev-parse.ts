import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Reference, GitCommandError } from "#domain"
import * as Const from "#const"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `rev-parse`))<
	Tag,
	(args: Arguments) => Effect.Effect<string, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
