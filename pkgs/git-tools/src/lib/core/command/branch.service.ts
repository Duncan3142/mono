import type { Duration } from "effect"
import { Effect } from "effect"
import { BranchExecutor } from "#executor"
import { BranchMode, GitCommandError } from "#domain"
import { Tag } from "#const"
import { RepositoryContext } from "#context"

interface Arguments {
	readonly mode?: BranchMode.Mode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class Service extends Effect.Service<Service>()(Tag.make(`command`, `print-refs`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[BranchExecutor.Tag, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			mode = BranchMode.Print(),
			timeout = "2 seconds",
		}: Arguments = {}): Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout> =>
			executor({ mode, directory, timeout })
	}),
}) {}

export { Service }
export type { Arguments }
