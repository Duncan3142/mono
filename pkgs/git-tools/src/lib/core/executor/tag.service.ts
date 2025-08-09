import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

type TagMode = Data.TaggedEnum<{
	Print: object
	Create: { readonly name: string }
}>

const { Print, Create, $is, $match } = Data.taggedEnum<TagMode>()

interface Arguments {
	readonly mode: TagMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class TagExecutor extends Context.Tag(tag(`executor`, `tag`))<
	TagExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default TagExecutor
export { Print, Create, $is, $match }
export type { Arguments }
