import { TaggedError } from "effect/Data"

const FETCH_REFS_NOT_FOUND_ERROR_TAG = "FETCH_REFS_NOT_FOUND_ERROR"

/**
 * Fetch Not Found Error
 */
class FetchRefsNotFoundError extends TaggedError(FETCH_REFS_NOT_FOUND_ERROR_TAG)<{
	references: ReadonlyArray<string>
}> {}

export { FetchRefsNotFoundError, FETCH_REFS_NOT_FOUND_ERROR_TAG }
