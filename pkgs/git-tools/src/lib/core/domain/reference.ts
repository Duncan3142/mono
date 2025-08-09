import { Data } from "effect"

type SHA = string

type Reference = Data.TaggedEnum<{
	Branch: { readonly name: string }
	Tag: { readonly name: string }
	Head: { readonly name: "HEAD" }
}>

const Reference = Data.taggedEnum<Reference>()

export type { SHA }
export { Reference }
