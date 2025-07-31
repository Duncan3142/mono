import { Effect, LogLevel, pipe } from "effect"
import PrintRefsCommand from "#command/print-refs.service"
import { type REF_TYPE, TAG, BRANCH } from "#domain/reference"
import { SERVICE_PREFIX } from "#const"

interface Arguments {
	level: Exclude<LogLevel.Literal, "None" | "All">
	message: string
}

/**
 * Print refs service
 */
class PrintRefs extends Effect.Service<PrintRefs>()(`${SERVICE_PREFIX}/case/print-refs`, {
	effect: Effect.gen(function* () {
		const command = yield* PrintRefsCommand

		return ({ message, level: logLevelLiteral }: Arguments): Effect.Effect<void> =>
			Effect.gen(function* () {
				const doPrint = (type: REF_TYPE) => command({ type })
				const logLevel = LogLevel.fromLiteral(logLevelLiteral)
				yield* pipe(
					Effect.all([Effect.logWithLevel(logLevel, message), doPrint(BRANCH), doPrint(TAG)], {
						discard: true,
					}),
					Effect.whenLogLevel(logLevel)
				)
			})
	}),
}) {}

export default PrintRefs
export type { Arguments }
