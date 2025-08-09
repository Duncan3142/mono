import { Data, Order } from "effect"

type SHA = string

type Reference = Data.TaggedEnum<{
	Branch: { readonly name: string }
	Tag: { readonly name: string }
	Head: { readonly name: "HEAD" }
}>

const { Branch, Head, Tag, $is, $match } = Data.taggedEnum<Reference>()

interface Sort {
	byName: Order.Order<Reference>
	byTag: Order.Order<Reference>
}

const sort: Sort = {
	/**
	 * Order reference by type
	 * @param reference - Reference to check
	 * @returns Reference ordering
	 */
	byTag: Order.mapInput(Order.string, ({ _tag }) => _tag),

	/**
	 * Order reference order by name
	 * @param reference - Reference to check
	 * @returns Reference ordering
	 */
	byName: Order.mapInput(Order.string, ({ name }) => name),
}

export type { Reference, SHA, Sort }
export { Branch, Tag, Head, $is, $match, sort }
