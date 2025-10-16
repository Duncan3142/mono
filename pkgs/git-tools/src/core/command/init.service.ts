import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { InitExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly bare?: boolean
	readonly initBranch?: string
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class InitCommand extends Effect.Service<InitCommand>()(TagFactory.make(`command`, `init`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[InitExecutor.InitExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args?: Arguments
		) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout> = ({
			bare = false,
			initBranch = "main",
			timeout = "2 seconds",
		} = {}) =>
			executor({ directory, timeout, bare, initBranch }).pipe(
				ExecutorTimer.duration({ tags: { "executor.name": "git.init" } })
			)

		return pipe(
			handler,
			LogSpan.wrap({ log: { message: "Git init" }, span: { name: "git.init" } })
		)
	}),
}) {}

const { Default } = InitCommand

export { InitCommand, Default }
export type { Arguments }
