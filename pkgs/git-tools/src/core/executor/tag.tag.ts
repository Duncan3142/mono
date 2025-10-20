import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { TagMode } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly mode: TagMode.TagMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class TagExecutor extends Context.Tag(TagFactory.make(`executor`, `tag`))<
	TagExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { TagExecutor }
export type { Arguments }
