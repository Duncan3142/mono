import { Data } from "effect"

interface ConfigKV {
	readonly key: string
	readonly value: string
}

type ConfigInput = Data.TaggedEnum<{
	List: object
	Set: ConfigKV
	Add: ConfigKV
}>

const { List, Set, Add, $is, $match } = Data.taggedEnum<ConfigInput>()

export { List, Set, Add, $is, $match }
export type { ConfigInput, ConfigKV }
