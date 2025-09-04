import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import type { GitCommandError } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly directory: string
	readonly message: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CommitExecutor extends Context.Tag(TagFactory.make(`executor`, `commit`))<
	CommitExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { CommitExecutor }
export type { Arguments }
