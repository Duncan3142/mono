import type { Effect } from "effect"
import { Context } from "effect"
import type { REF_TYPE } from "#domain/reference"
import { tag } from "#const"
import type { Repository } from "#domain/repository"

interface Arguments {
	readonly type: REF_TYPE
	readonly repository: Repository
}

/**
 * Print refs command service
 */
class PrintRefsCommandExecutor extends Context.Tag(tag(`command`, `print-refs-executor`))<
	PrintRefsCommandExecutor,
	({ type }: Arguments) => Effect.Effect<void>
>() {}

export default PrintRefsCommandExecutor
export type { Arguments }
