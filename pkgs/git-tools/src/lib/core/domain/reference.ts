import { Data } from "effect"

type SHA = string

type Reference = Data.TaggedEnum<{
	Branch: { readonly name: string }
	Tag: { readonly name: string }
	Head: { readonly name: "HEAD" }
}>

const { $is, $match, Branch, Head, Tag } = Data.taggedEnum<Reference>()

export type { SHA, Reference }
export { $is, $match, Branch, Head, Tag }
