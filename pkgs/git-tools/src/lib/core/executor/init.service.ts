import type { Duration, Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `init`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
