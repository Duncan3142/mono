import { Data } from "effect"
import * as Remote from "#domain/remote"

type Mode = Data.TaggedEnum<{
	Add: { readonly remote: Remote.Remote }
}>

const { $is, $match, Add } = Data.taggedEnum<Mode>()

export { $is, $match, Add }
export type { Mode }
