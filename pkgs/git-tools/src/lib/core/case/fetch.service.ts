import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { NonEmptyReadonlyArray } from "effect/Array"
import { SERVICE_PREFIX } from "#const"
import type { Remote } from "#domain/remote"
import type { FetchReference, WasFound } from "#domain/fetch-reference"
import type { FetchReferenceNotFoundError } from "#domain/fetch.error"

interface Arguments {
	fetchRefs: {
		remote: Remote
		refs: NonEmptyReadonlyArray<FetchReference>
	}
	repoDir: string
	depth?: number
	deepen?: boolean
}

/**
 * Reference service
 */
class Fetch extends Tag(`${SERVICE_PREFIX}/case/fetch`)<
	Fetch,
	(args: Arguments) => Effect<WasFound, FetchReferenceNotFoundError>
>() {}

export default Fetch
export type { Arguments }
