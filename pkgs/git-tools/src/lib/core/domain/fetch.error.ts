import { TaggedError } from "effect/Data"

const FETCH_REFERENCE_NOT_FOUND_ERROR_TAG = "FETCH_REFERENCE_NOT_FOUND_ERROR"

/**
 * Fetch Not Found Error
 */
class FetchReferenceNotFoundError extends TaggedError(FETCH_REFERENCE_NOT_FOUND_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

const FETCH_TIMEOUT_ERROR_TAG = "FETCH_TIMEOUT_ERROR"

/**
 * Fetch Timeout Error
 */
class FetchTimeoutError extends TaggedError(FETCH_TIMEOUT_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

const FETCH_FAILED_ERROR_TAG = "FETCH_FAILED_ERROR"

/**
 * Fetch Failed Error
 */
class FetchFailedError extends TaggedError(FETCH_FAILED_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

export {
	FetchReferenceNotFoundError,
	FETCH_REFERENCE_NOT_FOUND_ERROR_TAG,
	FetchTimeoutError,
	FETCH_TIMEOUT_ERROR_TAG,
	FetchFailedError,
	FETCH_FAILED_ERROR_TAG,
}
