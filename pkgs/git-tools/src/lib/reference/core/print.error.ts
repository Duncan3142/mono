import { TaggedError } from "effect/Data"

const LOG_REFERENCES_ERROR_TAG = "LOG_REFERENCES_ERROR"

/**
 * Error thrown when logging references fails
 */
class LogReferencesError extends TaggedError(LOG_REFERENCES_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

const LOG_REFERENCES_TIMEOUT_ERROR_TAG = "LOG_REFERENCES_TIMEOUT_ERROR"

/**
 * Error thrown when logging references times out
 */
class LogReferencesTimeoutError extends TaggedError(LOG_REFERENCES_TIMEOUT_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

export { LogReferencesError, LogReferencesTimeoutError }
