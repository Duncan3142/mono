import type { Array, Effect } from "effect"
import { Context } from "effect"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { tag } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"
import type { FetchMode } from "#domain/fetch"
import type { Repository } from "#domain/repository"

interface Arguments {
	readonly mode: FetchMode
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
	readonly repository: Repository
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
