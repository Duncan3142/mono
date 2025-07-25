import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { REF_TYPE } from "./reference.entity.ts"

interface Arguments {
	repoDirectory: string
	type: REF_TYPE
}

/**
 * Print service
 */
class Print extends Tag("PrintService")<
	Print,
	({ repoDirectory, type }: Arguments) => Effect<void>
>() {}

export default Print
export type { Arguments }
