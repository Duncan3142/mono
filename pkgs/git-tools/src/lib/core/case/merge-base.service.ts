import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	headSHA: string
	baseSHA: string
}

/**
 * Reference service
 */
class MergeBase extends Tag(`${SERVICE_PREFIX}/case/print-refs`)<
	MergeBase,
	(args: Arguments) => Effect<string>
>() {}

export default MergeBase
export type { Arguments }
