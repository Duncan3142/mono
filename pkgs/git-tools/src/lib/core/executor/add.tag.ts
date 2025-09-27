import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import type { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"

interface Arguments {
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class AddExecutor extends Context.Tag(TagFactory.make(`executor`, `add`))<
	AddExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { AddExecutor }
export type { Arguments }
