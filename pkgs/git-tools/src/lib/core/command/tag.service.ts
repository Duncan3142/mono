import { Effect, type Duration } from "effect"
import { TagExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, TagMode } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"

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

		return ({ mode = TagMode.Print(), timeout = "2 seconds" }: Arguments = {}): Effect.Effect<
			void,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> => executor({ mode, directory, timeout })
	}),
}) {}

const { Default } = TagCommand

export { TagCommand, Default }
export type { Arguments }
