import { Data } from "effect"
import type * as Remote from "./remote.ts"

type RemoteMode = Data.TaggedEnum<{
	Add: { readonly remote: Remote.Remote }
}>

const { $is, $match, Add } = Data.taggedEnum<RemoteMode>()

export { $is, $match, Add }
export type { RemoteMode }
