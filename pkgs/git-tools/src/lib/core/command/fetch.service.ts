import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { NonEmptyReadonlyArray } from "effect/Array"
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
	readonly refs: NonEmptyReadonlyArray<Reference>
}

/**
 * Fetch command service
 */
class FetchCommand extends Tag(`${SERVICE_PREFIX}/command/fetch`)<
	FetchCommand,
	({ mode, remote, refs }: Arguments) => Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchCommand
export { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH }
export type { Arguments, FetchMode, FetchModeInput }
