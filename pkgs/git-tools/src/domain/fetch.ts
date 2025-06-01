import type { NonEmptyReadonlyArray } from "effect/Array"
import { mapInput, type Order, boolean } from "effect/Order"
import type { Reference } from "./reference.ts"
import type { Remote } from "./remote.ts"

/**
 * Fetch refs found
 */
type WasFound = boolean
const Found = true
const NotFound = false

/**
 * Fetch Not Found Error
 */
class FetchNotFoundError extends Error {
	public override readonly name = "FetchNotFoundError" as const
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
const sortByOptionality: Order<FetchReference> = mapInput(boolean, (reference) =>
	isOptional(reference)
)

interface FetchReferences {
	remote: Remote
	refs: NonEmptyReadonlyArray<FetchReference>
}

export type { WasFound, FetchReference, FetchReferences, Optional, Required }
export {
	FetchNotFoundError,
	Found,
	NotFound,
	sortByOptionality,
	isOptional,
	optionalString,
	OPTIONAL,
	REQUIRED,
}
