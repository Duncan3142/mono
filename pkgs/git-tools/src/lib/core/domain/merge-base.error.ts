import { Data } from "effect"
import { SERVICE_PREFIX } from "#const"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = `${SERVICE_PREFIX}/MERGE_BASE_NOT_FOUND_ERROR`

/**
 * Fetch Not Found Error
 */
class MergeBaseNotFoundError extends Data.TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

export { MergeBaseNotFoundError, MERGE_BASE_NOT_FOUND_ERROR_TAG }
