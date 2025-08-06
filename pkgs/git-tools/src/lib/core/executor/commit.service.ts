import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CommitExecutor extends Context.Tag(tag(`executor`, `commit`))<
	CommitExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default CommitExecutor
export type { Arguments }
