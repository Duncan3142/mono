import { Effect, pipe, type Duration } from "effect"
import { LogSpan } from "@duncan3142/effect"
import { TagExecutor } from "#duncan3142/git-tools/core/executor"
import { type GitCommandError, TagMode } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

interface Arguments {
	readonly mode?: TagMode.TagMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class TagCommand extends Effect.Service<TagCommand>()(TagFactory.make(`command`, `tag`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[TagExecutor.TagExecutor, RepositoryContext.RepositoryContext],
			{
				concurrency: "unbounded",
			}
		)

		const handler: (
			args?: Arguments
		) => Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> = ({ mode = TagMode.Print(), timeout = "2 seconds" } = {}) =>
			executor({ mode, directory, timeout }).pipe(
				ExecutorTimer.duration({ tags: { "executor.name": "git.tag" } })
			)

		return pipe(
			handler,
			LogSpan.wrap({ log: { message: "Git tag" }, span: { name: "git.tag" } })
		)
	}),
}) {}

const { Default } = TagCommand

export { TagCommand, Default }
export type { Arguments }
