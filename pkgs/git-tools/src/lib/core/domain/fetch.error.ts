import { Data } from "effect"
import * as Const from "#const"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = Const.tag("domain", `FETCH_REFS_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class RefsNotFound extends Data.TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

const FETCH_DEPTH_EXCEEDED_ERROR_TAG = Const.tag("domain", `FETCH_DEPTH_EXCEEDED_ERROR`)

/**
 * Fetch Depth Exceeded Error
 */
class DepthExceeded extends Data.TaggedError(FETCH_DEPTH_EXCEEDED_ERROR_TAG)<{
	requestedDepth: number
	maxDepth: number
}> {}

export {
	RefsNotFound,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
	DepthExceeded,
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
}
