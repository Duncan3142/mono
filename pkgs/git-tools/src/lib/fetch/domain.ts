import type { NonEmptyReadonlyArray } from "effect/Array"
import { mapInput as orderMapInput, type Order, boolean as orderBoolean } from "effect/Order"
import { TaggedError } from "effect/Data"
import type { Reference } from "#reference/domain"
import type { Remote } from "#remote/domain"

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

/**
 * Fetch Not Found Error
 */
class FetchNotFoundError extends TaggedError(FETCH_NOT_FOUND_ERROR_TAG) {
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

// type Optionality = Optional | Required

const OPTIONALITY_ORDER_MAP = {
	required: 0,
	optional: 1,
} as const

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
	OPTIONALITY_ORDER_MAP,
}
