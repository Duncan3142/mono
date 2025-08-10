import { Data } from "effect"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type Mode = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const { $is, $match, Add, List, Set } = Data.taggedEnum<Mode>()

export { $is, $match, Add, List, Set }
export type { Mode, ConfigKV }
