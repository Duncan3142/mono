import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Reference, GitCommandError, ResetMode } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode: ResetMode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `reset`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
