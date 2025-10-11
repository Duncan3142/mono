import { Data } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = TagFactory.make("domain", `MERGE_BASE_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class MergeBaseNotFound extends Data.TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	headRef: string
	baseRef: string
	cause?: Error
}> {}

export { MergeBaseNotFound, MERGE_BASE_NOT_FOUND_ERROR_TAG }
