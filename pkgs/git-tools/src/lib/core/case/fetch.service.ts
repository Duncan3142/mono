import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { NonEmptyReadonlyArray } from "effect/Array"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchReference, WasFound } from "#domain/fetch-reference"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import type { FetchModeInput } from "#command/fetch.service"

interface Arguments {
	remote?: Remote
	refs: NonEmptyReadonlyArray<FetchReference>
	mode?: FetchModeInput
}

/**
 * Reference service
 */
class Fetch extends Tag(`${SERVICE_PREFIX}/case/fetch`)<
	Fetch,
	(args: Arguments) => Effect<WasFound, FetchRefsNotFoundError | FetchDepthExceededError>
>() {}

export default Fetch
export type { Arguments }
