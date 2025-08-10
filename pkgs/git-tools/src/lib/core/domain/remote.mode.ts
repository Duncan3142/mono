import { Data } from "effect"
import type { Remote } from "#duncan3142/git-tools/domain"

type Mode = Data.TaggedEnum<{
	Add: { readonly remote: Remote.Remote }
}>

const { $is, $match, Add } = Data.taggedEnum<Mode>()

export { $is, $match, Add }
export type { Mode }
