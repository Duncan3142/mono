import type { Effect, Array } from "effect"
import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchReference, WasFound } from "#domain/fetch-reference"
import type { FetchDepthExceededError, FetchRefsNotFoundError } from "#domain/fetch.error"
import type { FetchModeInput } from "#command/fetch.service"

interface Arguments {
	remote?: Remote
	refs: Array.NonEmptyReadonlyArray<FetchReference>
	mode?: FetchModeInput
}

/**
 * Reference service
 */
class Fetch extends Context.Tag(`${SERVICE_PREFIX}/case/fetch`)<
	Fetch,
	(args: Arguments) => Effect.Effect<WasFound, FetchRefsNotFoundError | FetchDepthExceededError>
>() {}

export default Fetch
export type { Arguments }
