import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { REF_TYPE } from "./reference.entity.ts"

interface Arguments {
	repoDirectory: string
	type: REF_TYPE
}

/**
 * Print Command service
 */
class PrintCommand extends Tag("PrintCommandService")<
	PrintCommand,
	{
		readonly exec: ({ repoDirectory, type }: Arguments) => Effect<void>
	}
>() {}

export default PrintCommand
export type { Arguments }
