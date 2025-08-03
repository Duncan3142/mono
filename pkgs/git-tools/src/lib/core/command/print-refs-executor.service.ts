import type { Effect } from "effect"
import { Context } from "effect"
import type { REF_TYPE } from "#domain/reference"
import { tag } from "#const"

interface Arguments {
	type: REF_TYPE
}

/**
 * Print refs command service
 */
class PrintRefsCommandExecutor extends Context.Tag(tag(`command/print-refs-executor`))<
	PrintRefsCommandExecutor,
	({ type }: Arguments) => Effect.Effect<void>
>() {}

export default PrintRefsCommandExecutor
export type { Arguments }
