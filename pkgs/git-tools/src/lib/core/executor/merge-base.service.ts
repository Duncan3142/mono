import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitSHA, Reference } from "#domain/reference"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class MergeBaseExecutor extends Context.Tag(tag(`executor`, `merge-base`))<
	MergeBaseExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		GitSHA,
		MergeBaseNotFoundError | GitCommandFailedError | GitCommandTimeoutError
	>
>() {}

export default MergeBaseExecutor
export type { Arguments }
