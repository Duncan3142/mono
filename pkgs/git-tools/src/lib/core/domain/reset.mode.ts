import { Data } from "effect"

type Mode = Data.TaggedEnum<{
	Hard: object
	Mixed: object
	Soft: object
}>

const { $is, $match, Hard, Mixed, Soft } = Data.taggedEnum<Mode>()

export { $is, $match, Hard, Mixed, Soft }
export type { Mode }
