import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import type { Reference } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RevParseExecutor extends Context.Tag(TagFactory.make(`executor`, `rev-parse`))<
	RevParseExecutor,
	(
		args: Arguments
	) => Effect.Effect<string, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { RevParseExecutor }
export type { Arguments }
