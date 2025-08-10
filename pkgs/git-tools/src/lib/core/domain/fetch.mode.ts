import { Data } from "effect"

type FetchMode = Data.TaggedEnum<{
	Depth: { readonly depth: number }
	DeepenBy: { readonly deepenBy: number }
}>

const { $is, $match, DeepenBy, Depth } = Data.taggedEnum<FetchMode>()

export { $is, $match, DeepenBy, Depth }
export type { FetchMode }
