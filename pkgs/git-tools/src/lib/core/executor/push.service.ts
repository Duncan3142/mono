import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly directory: string
	readonly forceWithLease: boolean
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class PushExecutor extends Context.Tag(tag(`executor`, `push`))<
	PushExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default PushExecutor
export type { Arguments }
