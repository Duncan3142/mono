import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import type { GitCommandError, TagMode } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly mode: TagMode.TagMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class TagExecutor extends Context.Tag(TagFactory.make(`executor`, `tag`))<
	TagExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { TagExecutor }
export type { Arguments }
