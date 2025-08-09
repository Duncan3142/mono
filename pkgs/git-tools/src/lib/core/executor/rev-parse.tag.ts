import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Reference, GitCommandError } from "#domain"
import { Tag as TagFactory } from "#const"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `rev-parse`))<
	Tag,
	(args: Arguments) => Effect.Effect<string, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
