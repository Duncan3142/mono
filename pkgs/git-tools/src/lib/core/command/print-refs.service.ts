import type { Effect } from "effect/Effect"
import { Tag } from "effect/Context"
import type { REF_TYPE } from "#domain/reference"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	type: REF_TYPE
}

/**
 * Print refs command service
 */
class PrintRefsCommand extends Tag(`${SERVICE_PREFIX}/command/print-refs`)<
	PrintRefsCommand,
	({ type }: Arguments) => Effect<void>
>() {}

export default PrintRefsCommand
export type { Arguments }
