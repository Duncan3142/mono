import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { RemoteMode } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly mode: RemoteMode.RemoteMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RemoteExecutor extends Context.Tag(TagFactory.make(`executor`, `remote`))<
	RemoteExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { RemoteExecutor }
export type { Arguments }
