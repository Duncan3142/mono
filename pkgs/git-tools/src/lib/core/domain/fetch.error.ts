import { Data } from "effect"
import type * as Fetch from "./fetch.ts"
import { TagFactory } from "#duncan3142/git-tools/core/const"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = TagFactory.make("domain", `FETCH_REFS_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class FetchRefsNotFound extends Data.TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

const FETCH_DEPTH_EXCEEDED_ERROR_TAG = TagFactory.make("domain", `FETCH_DEPTH_EXCEEDED_ERROR`)

/**
 * Fetch Depth Exceeded Error
 */
class FetchDepthExceeded extends Data.TaggedError(FETCH_DEPTH_EXCEEDED_ERROR_TAG)<{
	requestedDepth: Fetch.FetchDepth
	maxDepth: Fetch.FetchDepth
}> {}

export {
	FetchRefsNotFound,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
	FetchDepthExceeded,
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
}
