import type { NonEmptyReadonlyArray } from "effect/Array"
import { mapInput as orderMapInput, type Order, boolean as orderBoolean } from "effect/Order"
import { TaggedError } from "effect/Data"
import type { Reference } from "#reference/domain"
import type { Remote } from "#remote/domain"
import type { TaggedErrorCtor } from "#error/tagged"

/**
 * Fetch refs found
 */

const Found = true
/**
 * Found
 */
type Found = typeof Found

const NotFound = false
/**
 * Not found
 */
type NotFound = typeof NotFound

/**
 * Represents whether a fetch operation found the requested refs or not.
 */
type WasFound = Found | NotFound

const FETCH_NOT_FOUND_ERROR_TAG = "FETCH_NOT_FOUND_ERROR"

const FetchNotFoundErrorBase: TaggedErrorCtor<typeof FETCH_NOT_FOUND_ERROR_TAG> = TaggedError(
	FETCH_NOT_FOUND_ERROR_TAG
)

/**
 * Fetch Not Found Error
 */
class FetchNotFoundError extends FetchNotFoundErrorBase {
	public override readonly name: typeof this._tag = this._tag
}

const FETCH_TIMEOUT_ERROR_TAG = "FETCH_TIMEOUT_ERROR"

const FetchTimeoutErrorBase: TaggedErrorCtor<typeof FETCH_TIMEOUT_ERROR_TAG> =
	TaggedError(FETCH_TIMEOUT_ERROR_TAG)

/**
 * Fetch Timeout Error
 */
class FetchTimeoutError extends FetchTimeoutErrorBase {
	public override readonly name: typeof this._tag = this._tag
}

const FETCH_FAILED_ERROR_TAG = "FETCH_FAILED_ERROR"

const FetchFailedErrorBase: TaggedErrorCtor<typeof FETCH_FAILED_ERROR_TAG> =
	TaggedError(FETCH_FAILED_ERROR_TAG)

/**
 * Fetch Failed Error
 */
class FetchFailedError extends FetchFailedErrorBase {
	public override readonly name: typeof this._tag = this._tag
}

interface FetchReference extends Reference {
	optional?: boolean
}

/**
 * Fetch reference is optional
 * @param reference - Reference to check
 * @returns true if the reference is optional
 */
const isOptional = (reference: FetchReference): boolean => reference.optional ?? false

const OPTIONAL = "optional" as const
/**
 * Optional fetch reference
 */
type Optional = typeof OPTIONAL

const REQUIRED = "required" as const
/**
 * Required fetch reference
 */
type Required = typeof REQUIRED

/**
 * Returns a string representation of the optionality of a fetch reference
 * @param reference - Reference to check
 * @returns "optional" if the reference is optional, "required" otherwise
 */
const optionalString = (reference: FetchReference): Optional | Required =>
	isOptional(reference) ? OPTIONAL : REQUIRED

/**
 * Fetch reference order by optionality
 * @param reference - Reference to check
 * @returns FetchReference order
 */
const sortByOptionality: Order<FetchReference> = orderMapInput(orderBoolean, (reference) =>
	isOptional(reference)
)

interface FetchReferences {
	remote: Remote
	refs: NonEmptyReadonlyArray<FetchReference>
}

export type { WasFound, FetchReference, FetchReferences, Optional, Required }
export {
	FetchNotFoundError,
	FETCH_NOT_FOUND_ERROR_TAG,
	FetchFailedError,
	FETCH_FAILED_ERROR_TAG,
	FetchTimeoutError,
	FETCH_TIMEOUT_ERROR_TAG,
	Found,
	NotFound,
	sortByOptionality,
	isOptional,
	optionalString,
	OPTIONAL,
	REQUIRED,
}
