import { Data } from "effect"

type Mode = Data.TaggedEnum<{
	Create: object
	Standard: object
}>

const { $is, $match, Create, Standard } = Data.taggedEnum<Mode>()

export { Create, Standard, $is, $match }
export type { Mode }
