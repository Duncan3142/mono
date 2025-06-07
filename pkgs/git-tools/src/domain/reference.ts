import { TaggedError } from "effect/Data"
import { mapInput as orderMapInput, string as orderString, type Order } from "effect/Order"
import type { TaggedErrorCtor } from "#error/tagged"

const BRANCH = "branch"
const TAG = "tag"

/**
 * Ref branch type
 */
type BRANCH_TYPE = typeof BRANCH

/**
 * Ref tag type
 */
type TAG_TYPE = typeof TAG

/**
 * Ref type
 */
type REF_TYPE = BRANCH_TYPE | TAG_TYPE

interface Reference {
	name: string
	type?: REF_TYPE
}

/**
 * Extracts the type of a reference.
 * @param reference - Reference to check
 * @returns the reference type, defaults to BRANCH if not specified
 */
const type = (reference: Reference): REF_TYPE => reference.type ?? BRANCH

/**
 * Order reference by type
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const sortByType: Order<Reference> = orderMapInput(orderString, (reference) => type(reference))

/**
 * Order reference order by name
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const sortByName: Order<Reference> = orderMapInput(orderString, ({ name }) => name)

const LOG_REFERENCES_ERROR = "LOG_REFERENCES_ERROR"

const LogReferencesErrorBase: TaggedErrorCtor<typeof LOG_REFERENCES_ERROR> =
	TaggedError(LOG_REFERENCES_ERROR)

/**
 * Error thrown when logging references fails
 */
class LogReferencesError extends LogReferencesErrorBase {
	public override readonly name: typeof this._tag = this._tag
}

export type { BRANCH_TYPE, TAG_TYPE, REF_TYPE, Reference }
export { LogReferencesError, BRANCH, TAG, type, sortByType, sortByName }
