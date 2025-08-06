import { Data, type Array, type Duration, type Effect } from "effect"
import { Context } from "effect"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { tag } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

type FetchMode = Data.TaggedEnum<{
	Depth: { readonly depth: number }
	DeepenBy: { readonly deepenBy: number }
}>

const { Depth, DeepenBy, $is, $match } = Data.taggedEnum<FetchMode>()

interface Arguments {
	readonly mode: FetchMode
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class FetchExecutor extends Context.Tag(tag(`executor`, `fetch`))<
	FetchExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		FetchRefsNotFoundError | GitCommandFailedError | GitCommandTimeoutError
	>
>() {}

export default FetchExecutor
export { Depth, DeepenBy, $is, $match }
export type { Arguments }
