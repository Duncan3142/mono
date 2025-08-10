import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#const"
import { GitCommandError } from "#domain"

interface Arguments {
	readonly directory: string
	readonly forceWithLease: boolean
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `push`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
