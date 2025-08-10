import { Data } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import { Fetch } from "#duncan3142/git-tools/domain"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = TagFactory.make("domain", `FETCH_REFS_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class RefsNotFound extends Data.TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

const FETCH_DEPTH_EXCEEDED_ERROR_TAG = TagFactory.make("domain", `FETCH_DEPTH_EXCEEDED_ERROR`)

/**
 * Fetch Depth Exceeded Error
 */
class DepthExceeded extends Data.TaggedError(FETCH_DEPTH_EXCEEDED_ERROR_TAG)<{
	requestedDepth: Fetch.Depth
	maxDepth: Fetch.Depth
}> {}

export {
	RefsNotFound,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
	DepthExceeded,
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
}
