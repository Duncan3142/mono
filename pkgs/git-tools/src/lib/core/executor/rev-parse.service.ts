import type { Duration, Effect } from "effect"
import { Context } from "effect"
import * as Reference from "#domain/reference"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RevParseExecutor extends Context.Tag(Const.tag(`executor`, `rev-parse`))<
	RevParseExecutor,
	(args: Arguments) => Effect.Effect<string, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { RevParseExecutor }
export type { Arguments }
