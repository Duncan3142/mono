import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
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
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { BranchExecutor }
export type { Arguments }
