import { Data } from "effect"
import { tag } from "#const"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = tag(`MERGE_BASE_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class MergeBaseNotFoundError extends Data.TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	headRef: string
	baseRef: string
	cause?: Error
}> {}

export { MergeBaseNotFoundError, MERGE_BASE_NOT_FOUND_ERROR_TAG }
