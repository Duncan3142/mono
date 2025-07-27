import type { Array, Effect } from "effect"
import { Context } from "effect"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { SERVICE_PREFIX } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"

const FETCH_MODE_DEPTH = "depth"
const FETCH_MODE_DEEPEN_BY = "deepen-by"

type FetchMode = typeof FETCH_MODE_DEPTH | typeof FETCH_MODE_DEEPEN_BY

interface FetchModeInput {
	mode: FetchMode
	value: number
}

interface Arguments {
	readonly mode: FetchModeInput
	readonly remote: Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference>
}

/**
 * Fetch command service
 */
class FetchCommand extends Context.Tag(`${SERVICE_PREFIX}/command/fetch`)<
	FetchCommand,
	({ mode, remote, refs }: Arguments) => Effect.Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchCommand
export { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH }
export type { Arguments, FetchMode, FetchModeInput }
