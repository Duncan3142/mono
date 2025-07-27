import { Order } from "effect"

const BRANCH = "branch"
const TAG = "tag"

type BRANCH_TYPE = typeof BRANCH

type TAG_TYPE = typeof TAG

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
const sortByType: Order.Order<Reference> = Order.mapInput(Order.string, (reference) =>
	type(reference)
)

/**
 * Order reference order by name
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const sortByName: Order.Order<Reference> = Order.mapInput(Order.string, ({ name }) => name)

export type { BRANCH_TYPE, TAG_TYPE, REF_TYPE, Reference }
export { BRANCH, TAG, type, sortByType, sortByName }
