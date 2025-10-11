import { Data } from "effect"

type ResetMode = Data.TaggedEnum<{
	Hard: object
	Mixed: object
	Soft: object
}>

const { $is, $match, Hard, Mixed, Soft } = Data.taggedEnum<ResetMode>()

export { $is, $match, Hard, Mixed, Soft }
export type { ResetMode }
