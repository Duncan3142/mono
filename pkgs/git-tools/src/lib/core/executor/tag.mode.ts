import { Data } from "effect"

type Mode = Data.TaggedEnum<{
	Print: object
	Create: { readonly name: string }
}>

const { $is, $match, Print, Create } = Data.taggedEnum<Mode>()

export { $is, $match, Print, Create }
export type { Mode }
