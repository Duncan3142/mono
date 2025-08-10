import { Data } from "effect"

type ConfigScope = Data.TaggedEnum<{
	Global: object
	Local: object
}>

const { $is, $match, Global, Local } = Data.taggedEnum<ConfigScope>()

export { $is, $match, Global, Local }
export type { ConfigScope }
