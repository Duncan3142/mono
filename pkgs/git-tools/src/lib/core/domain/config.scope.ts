import { Data } from "effect"

type Scope = Data.TaggedEnum<{
	Global: object
	Local: { readonly directory: string }
}>

const { $is, $match, Global, Local } = Data.taggedEnum<Scope>()

export { $is, $match, Global, Local }
export type { Scope }
