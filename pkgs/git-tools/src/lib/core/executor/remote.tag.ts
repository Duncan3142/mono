import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"
import * as Remote from "#domain/remote"

type Mode = Data.TaggedEnum<{
	Add: { readonly remote: Remote.Remote }
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
class Tag extends Context.Tag(Const.tag(`executor`, `remote`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode }
export type { Arguments }
