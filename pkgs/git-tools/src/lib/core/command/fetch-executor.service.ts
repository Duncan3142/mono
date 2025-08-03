import type { Array, Effect } from "effect"
import { Context } from "effect"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { tag } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"
import type { FetchModeInput } from "#domain/fetch-reference"

interface Arguments {
	readonly mode: FetchModeInput
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
}

/**
 * Fetch command service
 */
class FetchCommandExecutor extends Context.Tag(tag(`command`, `fetch-executor`))<
	FetchCommandExecutor,
	({ mode, remote, refs }: Arguments) => Effect.Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchCommandExecutor
export type { Arguments }
