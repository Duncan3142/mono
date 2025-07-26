import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { FetchReferenceNotFoundError } from "#domain/fetch.error"
import type { ReferenceSpecs } from "#domain/reference-spec"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	readonly repoDir: string
	readonly depth: number
	readonly deepen: boolean
	readonly refSpecs: ReferenceSpecs
}

/**
 * Fetch command service
 */
class FetchCommand extends Tag(`${SERVICE_PREFIX}/command/fetch`)<
	FetchCommand,
	({ repoDir, depth, deepen, refSpecs }: Arguments) => Effect<void, FetchReferenceNotFoundError>
>() {}

export default FetchCommand
export type { Arguments }
