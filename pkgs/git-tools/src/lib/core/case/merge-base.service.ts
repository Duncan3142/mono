import type { Effect } from "effect"
import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"

interface Arguments {
	headSHA: string
	baseSHA: string
}

/**
 * Reference service
 */
class MergeBase extends Context.Tag(`${SERVICE_PREFIX}/case/merge-base`)<
	MergeBase,
	(args: Arguments) => Effect.Effect<string, MergeBaseNotFoundError>
>() {}

export default MergeBase
export type { Arguments }
