import { Data } from "effect"
import { tag } from "#const"

type Depth = number

const FETCH_DEPTH_TAG = tag("domain", "fetch-depth")
const FETCH_DEEPEN_BY_TAG = tag("domain", "fetch-deepen-by")

interface FetchDepth {
	readonly _tag: typeof FETCH_DEPTH_TAG
	readonly depth: Depth
}

const FetchDepth = Data.tagged<FetchDepth>(FETCH_DEPTH_TAG)

interface FetchDeepenBy {
	readonly _tag: typeof FETCH_DEEPEN_BY_TAG
	readonly deepenBy: Depth
}
const FetchDeepenBy = Data.tagged<FetchDeepenBy>(FETCH_DEEPEN_BY_TAG)

type FetchMode = FetchDeepenBy | FetchDepth

export type { FetchMode, Depth }
export { FETCH_DEPTH_TAG, FetchDepth, FETCH_DEEPEN_BY_TAG, FetchDeepenBy }
