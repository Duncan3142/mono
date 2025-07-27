import { TaggedError } from "effect/Data"
import { SERVICE_PREFIX } from "#const"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = `${SERVICE_PREFIX}/FETCH_REFS_NOT_FOUND_ERROR`

/**
 * Fetch Not Found Error
 */
class FetchRefsNotFoundError extends TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

export { FetchRefsNotFoundError, FETCH_REFS_NOT_FOUND_ERROR_TAG }
