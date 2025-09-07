import { Data } from "effect"

type BranchMode = Data.TaggedEnum<{
	Print: object
}>

const { Print, $is, $match } = Data.taggedEnum<BranchMode>()

export { Print, $is, $match }
export type { BranchMode }
