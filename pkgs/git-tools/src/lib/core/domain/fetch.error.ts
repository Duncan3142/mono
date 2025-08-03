import { Data } from "effect"
import { tag } from "#const"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = tag("domain", `FETCH_REFS_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class FetchRefsNotFoundError extends Data.TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

const FETCH_DEPTH_EXCEEDED_ERROR_TAG = tag("domain", `FETCH_DEPTH_EXCEEDED_ERROR`)

/**
 * Fetch Depth Exceeded Error
 */
class FetchDepthExceededError extends Data.TaggedError(FETCH_DEPTH_EXCEEDED_ERROR_TAG)<{
	requestedDepth: number
	maxDepth: number
}> {}

export {
	FetchRefsNotFoundError,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
	FetchDepthExceededError,
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
}
