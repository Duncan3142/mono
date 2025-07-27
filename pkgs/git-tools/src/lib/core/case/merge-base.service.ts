import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import { SERVICE_PREFIX } from "#const"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"

interface Arguments {
	headSHA: string
	baseSHA: string
}

/**
 * Reference service
 */
class MergeBase extends Tag(`${SERVICE_PREFIX}/case/merge-base`)<
	MergeBase,
	(args: Arguments) => Effect<string, MergeBaseNotFoundError>
>() {}

export default MergeBase
export type { Arguments }
