import type { Array, Effect } from "effect"
import { Context } from "effect"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { tag } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"
import type { FetchMode } from "#domain/fetch"

interface Arguments {
	readonly mode: FetchMode
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly directory: string
}

/**
 * Fetch command service
 */
class FetchExecutor extends Context.Tag(tag(`executor`, `fetch`))<
	FetchExecutor,
	({ mode, remote, refs }: Arguments) => Effect.Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchExecutor
export type { Arguments }
