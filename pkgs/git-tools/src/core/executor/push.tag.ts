import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { Reference, Remote } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly directory: string
	readonly forceWithLease: boolean
	readonly remote: Remote.Remote
	readonly ref: Reference.Reference
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class PushExecutor extends Context.Tag(TagFactory.make(`executor`, `push`))<
	PushExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { PushExecutor }
export type { Arguments }
