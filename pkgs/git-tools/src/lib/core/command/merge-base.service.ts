import type { Duration } from "effect"
import { Effect } from "effect"
import { Tag } from "#const"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"
import type { GitSHA, Reference } from "#domain/reference"
import MergeBaseExecutor from "#executor/merge-base.service"
import Tag from "#context/repository.service"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Reference service
 */
class MergeBaseCommand extends Effect.Service<MergeBaseCommand>()(
	tag(`command`, `merge-base`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all([MergeBaseExecutor, Tag], {
				concurrency: "unbounded",
			})

			return ({
				headRef,
				baseRef,
				timeout = "2 seconds",
			}: Arguments): Effect.Effect<
				GitSHA,
				GitCommandFailedError | GitCommandTimeoutError | MergeBaseNotFoundError
			> =>
				executor({
					headRef,
					baseRef,
					directory,
					timeout,
				})
		}),
	}
) {}

export default MergeBaseCommand
export type { Arguments }
