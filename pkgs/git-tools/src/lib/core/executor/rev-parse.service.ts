import type { Duration, Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RevParseExecutor extends Context.Tag(tag(`executor`, `rev-parse`))<
	RevParseExecutor,
	(args: Arguments) => Effect.Effect<string, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default RevParseExecutor
export type { Arguments }
