import { TaggedError } from "effect/Data"

const PRINT_REFERENCES_ERROR_TAG = "PRINT_REFERENCES_ERROR"

/**
 * Error thrown when printing references fails
 */
class PrintReferencesError extends TaggedError(PRINT_REFERENCES_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

const PRINT_REFERENCES_TIMEOUT_ERROR_TAG = "PRINT_REFERENCES_TIMEOUT_ERROR"

/**
 * Error thrown when printing references times out
 */
class PrintReferencesTimeoutError extends TaggedError(PRINT_REFERENCES_TIMEOUT_ERROR_TAG) {
	public override readonly name: typeof this._tag = this._tag
}

export { PrintReferencesError, PrintReferencesTimeoutError }
