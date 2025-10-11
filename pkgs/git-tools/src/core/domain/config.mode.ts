import { Data } from "effect"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type ConfigMode = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const { $is, $match, Add, List, Set } = Data.taggedEnum<ConfigMode>()

export { $is, $match, Add, List, Set }
export type { ConfigMode, ConfigKV }
