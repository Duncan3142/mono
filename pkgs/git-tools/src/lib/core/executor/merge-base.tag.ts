import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#const"
import { GitCommandError, Reference, MergeBaseError } from "#domain"

interface Arguments {
	readonly headRef: Reference.Reference
	readonly baseRef: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `merge-base`))<
	Tag,
	(
		args: Arguments
	) => Effect.Effect<
		Reference.SHA,
		MergeBaseError.NotFound | GitCommandError.Failed | GitCommandError.Timeout
	>
>() {}

export { Tag }
export type { Arguments }
