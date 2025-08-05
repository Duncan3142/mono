import type { Duration, Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { ResetMode } from "#domain/reset"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly mode: ResetMode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ResetExecutor extends Context.Tag(tag(`executor`, `reset`))<
	ResetExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default ResetExecutor
export type { Arguments }
