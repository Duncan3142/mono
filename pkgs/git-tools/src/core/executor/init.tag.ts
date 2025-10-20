import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"

interface Arguments {
	readonly directory: string
	readonly bare: boolean
	readonly initBranch: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class InitExecutor extends Context.Tag(TagFactory.make(`executor`, `init`))<
	InitExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { InitExecutor }
export type { Arguments }
