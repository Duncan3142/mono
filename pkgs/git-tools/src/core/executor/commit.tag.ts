import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { CommandError } from "@duncan3142/effect"

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
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { CommitExecutor }
export type { Arguments }
