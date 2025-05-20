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
 * Error thrown when logging references fails
 */
class LogReferencesError extends Error {
	public override readonly name = "LogReferencesError" as const
}

export type { BRANCH_TYPE, TAG_TYPE, REF_TYPE, Reference }
export { LogReferencesError, BRANCH, TAG }
