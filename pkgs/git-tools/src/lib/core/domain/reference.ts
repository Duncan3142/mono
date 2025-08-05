import { Data, Order } from "effect"
import { tag } from "#const"

type GitSHA = string

const BRANCH_REF_TAG = tag("domain", "BranchRef")
const TAG_REF_TAG = tag("domain", "TagRef")

const BRANCH = "BRANCH"
const TAG = "TAG"

type REF_TYPE = typeof BRANCH | typeof TAG

interface BranchRef {
	readonly _tag: typeof BRANCH_REF_TAG
	readonly name: string
}

const BranchRef = Data.tagged<BranchRef>(BRANCH_REF_TAG)

interface TagRef {
	readonly _tag: typeof TAG_REF_TAG
	readonly name: string
}

const TagRef = Data.tagged<TagRef>(TAG_REF_TAG)

const HEAD_REF_TAG = tag("domain", "Head")

interface HeadRef {
	readonly _tag: typeof HEAD_REF_TAG
	readonly name: "HEAD"
}

const HeadRef = Data.tagged<HeadRef>(HEAD_REF_TAG)

type Reference = BranchRef | TagRef | HeadRef

/**
 * Order reference by type
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const sortByTag: Order.Order<Reference> = Order.mapInput(Order.string, ({ _tag }) => _tag)

/**
 * Order reference order by name
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const sortByName: Order.Order<Reference> = Order.mapInput(Order.string, ({ name }) => name)

export type { Reference, REF_TYPE, GitSHA }
export {
	BRANCH_REF_TAG,
	BranchRef,
	TAG_REF_TAG,
	TagRef,
	HEAD_REF_TAG,
	HeadRef,
	sortByTag,
	sortByName,
	BRANCH,
	TAG,
}
