import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

type TagMode = Data.TaggedEnum<{
	Print: object
	Create: { readonly name: string }
}>

const TagMode = Data.taggedEnum<TagMode>()

interface Arguments {
	readonly mode: TagMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class TagExecutor extends Context.Tag(Const.tag(`executor`, `tag`))<
	TagExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { TagExecutor, TagMode }
export type { Arguments }
