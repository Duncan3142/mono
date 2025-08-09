import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Reference from "#domain/reference"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

type Mode = Data.TaggedEnum<{
	Hard: object
	Mixed: object
	Soft: object
}>

const Mode = Data.taggedEnum<Mode>()

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode: Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `reset`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode }
export type { Arguments }
