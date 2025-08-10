import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import type { GitCommandError, RemoteMode } from "#duncan3142/git-tools/domain"

interface Arguments {
	readonly mode: RemoteMode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `remote`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
