import { type Duration, type Effect, Context } from "effect"
import type { Reference, GitCommandError, ResetMode } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/core/const"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode: ResetMode.ResetMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ResetExecutor extends Context.Tag(TagFactory.make(`executor`, `reset`))<
	ResetExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { ResetExecutor }
export type { Arguments }
