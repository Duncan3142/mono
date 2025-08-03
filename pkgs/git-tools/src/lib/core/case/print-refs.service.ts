import type { LogLevel } from "effect"
import { Effect } from "effect"
import PrintRefsCommand from "#command/print-refs.service"
import { tag } from "#const"

interface Arguments {
	readonly directory: string
	readonly logLevel: Exclude<LogLevel.Literal, "None" | "All">
}

/**
 * Print refs service
 */
class PrintRefs extends Effect.Service<PrintRefs>()(tag(`case`, `print-refs`), {
	effect: Effect.gen(function* () {
		const commandExecutor = yield* PrintRefsCommand

		return ({ logLevel: level, directory }: Arguments): Effect.Effect<void> =>
			commandExecutor({ directory }).pipe(Effect.whenLogLevel(level), Effect.asVoid)
	}),
}) {}

export default PrintRefs
export type { Arguments }
