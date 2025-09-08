import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import type {
	GitCommandError,
	Reference,
	MergeBaseError,
} from "#duncan3142/git-tools/lib/core/domain"

interface Arguments {
	readonly headRef: Reference.Reference
	readonly baseRef: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class MergeBaseExecutor extends Context.Tag(TagFactory.make(`executor`, `merge-base`))<
	MergeBaseExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		Reference.SHA,
		| MergeBaseError.MergeBaseNotFound
		| GitCommandError.GitCommandFailed
		| GitCommandError.GitCommandTimeout
	>
>() {}

export { MergeBaseExecutor }
export type { Arguments }
