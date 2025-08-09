import type { Duration, Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CommitExecutor extends Context.Tag(Const.tag(`executor`, `commit`))<
	CommitExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { CommitExecutor }
export type { Arguments }
