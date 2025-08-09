import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class InitExecutor extends Context.Tag(tag(`executor`, `init`))<
	InitExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default InitExecutor
export type { Arguments }
