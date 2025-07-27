import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { NonEmptyReadonlyArray } from "effect/Array"
import type { FetchRefsNotFoundError } from "#domain/fetch.error"
import { SERVICE_PREFIX } from "#const"
import type { Reference } from "#domain/reference"
import type { Remote } from "#domain/remote"

interface Arguments {
	readonly depth: number
	readonly deepen: boolean
	readonly remote?: Remote
	readonly refs: NonEmptyReadonlyArray<Reference>
}

/**
 * Fetch command service
 */
class FetchCommand extends Tag(`${SERVICE_PREFIX}/command/fetch`)<
	FetchCommand,
	({ depth, deepen, remote, refs }: Arguments) => Effect<void, FetchRefsNotFoundError>
>() {}

export default FetchCommand
export type { Arguments }
