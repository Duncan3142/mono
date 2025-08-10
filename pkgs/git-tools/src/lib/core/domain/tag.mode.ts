import { Data } from "effect"

type TagMode = Data.TaggedEnum<{
	Print: object
	Create: { readonly name: string }
}>

const { $is, $match, Print, Create } = Data.taggedEnum<TagMode>()

export { $is, $match, Print, Create }
export type { TagMode }
