import type { Duration } from "effect"
import { Effect } from "effect"
import { BranchExecutor } from "#duncan3142/git-tools/executor"
import { BranchMode, GitCommandError } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

interface Arguments {
	readonly mode?: BranchMode.Mode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `print-refs`), {
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

const Default = Service.Default

export { Service, Default }
export type { Arguments }
