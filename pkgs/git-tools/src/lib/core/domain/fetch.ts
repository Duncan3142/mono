import { Data } from "effect"
import { tag } from "#const"

type Depth = number

const FETCH_DEPTH_TAG = tag("domain", "fetch-depth")
const FETCH_DEEPEN_BY_TAG = tag("domain", "fetch-deepen-by")

interface FetchModeDepth {
	readonly _tag: typeof FETCH_DEPTH_TAG
	readonly depth: Depth
}

const FetchModeDepth = Data.tagged<FetchModeDepth>(FETCH_DEPTH_TAG)

interface FetchModeDeepenBy {
	readonly _tag: typeof FETCH_DEEPEN_BY_TAG
	readonly deepenBy: Depth
}
const FetchModeDeepenBy = Data.tagged<FetchModeDeepenBy>(FETCH_DEEPEN_BY_TAG)

type FetchMode = FetchModeDeepenBy | FetchModeDepth

export type { FetchMode, Depth }
export { FETCH_DEPTH_TAG, FetchModeDepth, FETCH_DEEPEN_BY_TAG, FetchModeDeepenBy }
