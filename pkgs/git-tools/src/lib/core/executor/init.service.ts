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
class InitExecutor extends Context.Tag(Const.tag(`executor`, `init`))<
	InitExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { InitExecutor }
export type { Arguments }
