import { Effect, type Duration } from "effect"
import { TagExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { type GitCommandError, TagMode } from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { ExecutorDuration, ExecutorLog } from "#duncan3142/git-tools/lib/core/telemetry"

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
		> = ExecutorLog.wrap("Git tag", ({ mode = TagMode.Print(), timeout = "2 seconds" } = {}) =>
			executor({ mode, directory, timeout }).pipe(
				ExecutorDuration.duration("git-tag"),
				Effect.withSpan("git-tag")
			)
		)
		return handler
	}),
}) {}

const { Default } = TagCommand

export { TagCommand, Default }
export type { Arguments }
