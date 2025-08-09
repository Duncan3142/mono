import { Data } from "effect"
import { Tag } from "#const"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = Tag.make("domain", `MERGE_BASE_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class NotFound extends Data.TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	headRef: string
	baseRef: string
	cause?: Error
}> {}

export { NotFound, MERGE_BASE_NOT_FOUND_ERROR_TAG }
