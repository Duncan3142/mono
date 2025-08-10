import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#const"
import { GitCommandError, TagMode } from "#domain"

interface Arguments {
	readonly mode: TagMode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `tag`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
