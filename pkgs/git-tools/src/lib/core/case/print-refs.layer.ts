import { Effect, Layer, LogLevel, pipe } from "effect"
import PrintRefs, { type Arguments } from "./print-refs.service.ts"
import PrintRefsCommand from "#command/print-refs.service"
import { type REF_TYPE, TAG, BRANCH } from "#domain/reference"

const PrintRefsLive: Layer.Layer<PrintRefs, never, PrintRefsCommand> = Layer.effect(
	PrintRefs,
	Effect.gen(function* () {
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
	})
)

export default PrintRefsLive
