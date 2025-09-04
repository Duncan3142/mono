import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/core/const"
import type { GitCommandError, BranchMode } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly mode: BranchMode.BranchMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class BranchExecutor extends Context.Tag(TagFactory.make(`executor`, `branch`))<
	BranchExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { BranchExecutor }
export type { Arguments }
