import { Data } from "effect"

type Mode = Data.TaggedEnum<{
	Depth: { readonly depth: number }
	DeepenBy: { readonly deepenBy: number }
}>

const { $is, $match, DeepenBy, Depth } = Data.taggedEnum<Mode>()

export { $is, $match, DeepenBy, Depth }
export type { Mode }
