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
class Tag extends Context.Tag(Const.tag(`executor`, `rev-parse`))<
	Tag,
	(args: Arguments) => Effect.Effect<string, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
