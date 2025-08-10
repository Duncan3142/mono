import { type Duration, type Effect, Context } from "effect"
import type { Reference, GitCommandError, ResetMode } from "#duncan3142/git-tools/domain"
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
