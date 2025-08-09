import { Data } from "effect"

type Mode = Data.TaggedEnum<{
	Print: object
}>

const { Print, $is, $match } = Data.taggedEnum<Mode>()

export { Print, $is, $match }
export type { Mode }
