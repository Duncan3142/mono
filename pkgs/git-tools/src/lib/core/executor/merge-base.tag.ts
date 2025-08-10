import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import type { GitCommandError, Reference, MergeBaseError } from "#duncan3142/git-tools/domain"

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
