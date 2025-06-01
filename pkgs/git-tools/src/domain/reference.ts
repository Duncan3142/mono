import { mapInput, string, type Order } from "effect/Order"

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
 * Fetch reference order by type
 * @param reference - Reference to check
 * @returns FetchReference order
 */
const sortByType: Order<Reference> = mapInput(string, (reference) => type(reference))

/**
 * Fetch reference order by type
 * @param reference - Reference to check
 * @returns FetchReference order
 */
const sortByName: Order<Reference> = mapInput(string, ({ name }) => name)

/**
 * Error thrown when logging references fails
 */
class LogReferencesError extends Error {
	public override readonly name = "LogReferencesError" as const
}

export type { BRANCH_TYPE, TAG_TYPE, REF_TYPE, Reference }
export { LogReferencesError, BRANCH, TAG, type, sortByType, sortByName }
