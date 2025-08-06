import type { Duration } from "effect"
import { Effect } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import Repository from "#context/repository.service"
import { RESET_MODE_HARD, type ResetMode } from "#domain/reset"
import ResetExecutor from "#executor/reset.service"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

interface Arguments {
	readonly ref: Reference
	readonly mode?: ResetMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class ResetCommand extends Effect.Service<ResetCommand>()(tag(`command`, `reset`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all([ResetExecutor, Repository], {
			concurrency: "unbounded",
		})

		return ({
			ref,
			mode = RESET_MODE_HARD,
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError> =>
			executor({ ref, mode, directory, timeout })
	}),
}) {}

export default ResetCommand
export type { Arguments }
