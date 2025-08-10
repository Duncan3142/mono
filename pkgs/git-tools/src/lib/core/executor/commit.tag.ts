import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { GitCommandError } from "#duncan3142/git-tools/domain"

interface Arguments {
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `commit`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
