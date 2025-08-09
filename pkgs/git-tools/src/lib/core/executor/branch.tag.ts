import type { Duration, Effect } from "effect"
import { Context, Data } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

type Mode = Data.TaggedEnum<{
	Print: object
}>

const Mode = Data.taggedEnum<Mode>()

interface Arguments {
	readonly mode: Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `branch`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode }
export type { Arguments }
