import { TaggedError } from "effect/Data"
import { SERVICE_PREFIX } from "#const"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = `${SERVICE_PREFIX}/MERGE_BASE_NOT_FOUND_ERROR`

/**
 * Fetch Not Found Error
 */
class MergeBaseNotFoundError extends TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

export { MergeBaseNotFoundError, MERGE_BASE_NOT_FOUND_ERROR_TAG }
