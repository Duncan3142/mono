import type { Array, Duration, Effect } from "effect"
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
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class FetchExecutor extends Context.Tag(tag(`executor`, `fetch`))<
	FetchExecutor,
	(args: Arguments) => Effect.Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchExecutor
export type { Arguments }
