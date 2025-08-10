import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { GitCommandError, BranchMode } from "#duncan3142/git-tools/domain"

interface Arguments {
	readonly mode: BranchMode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `branch`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
