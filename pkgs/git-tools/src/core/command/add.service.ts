import { Effect, type Duration, pipe } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { AddExecutor } from "#duncan3142/git-tools/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class AddCommand extends Effect.Service<AddCommand>()(TagFactory.make(`command`, `add`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[AddExecutor.AddExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args?: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = ({ timeout = "2 seconds" } = {}) =>
			executor({ directory, timeout }).pipe(
				ExecutorTimer.duration({ tags: { "executor.name": "git.add" } })
			)

		return pipe(
			handler,
			LogSpan.wrap({ log: { message: "Git add" }, span: { name: "git.add" } })
		)
	}),
}) {}

const { Default } = AddCommand

export { AddCommand, Default }
export type { Arguments }
