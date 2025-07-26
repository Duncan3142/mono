import { effect as layerEffect, type Layer } from "effect/Layer"
import { gen as effectGen } from "effect/Effect"
import { pipe } from "effect/Function"
import {
	type Effect,
	all as effectAll,
	whenLogLevel as effectWhenLogLevel,
	logWithLevel as effectLogWithLevel,
} from "effect/Effect"
import { fromLiteral as logLevelFromLiteral } from "effect/LogLevel"
import PrintRefs, { type Arguments } from "./print-refs.service.ts"
import PrintRefsCommand from "#command/print-refs.service"
import { type REF_TYPE, TAG, BRANCH } from "#domain/reference"

const PrintRefsLive: Layer<PrintRefs, never, PrintRefsCommand> = layerEffect(
	PrintRefs,
	effectGen(function* () {
		const command = yield* PrintRefsCommand

		return ({ message, level }: Arguments): Effect<void> =>
			effectGen(function* () {
				const doPrint = (type: REF_TYPE) => command({ type })

				yield* pipe(
					effectAll(
						[
							effectLogWithLevel(logLevelFromLiteral(level), message),
							doPrint(BRANCH),
							doPrint(TAG),
						],
						{
							discard: true,
						}
					),
					effectWhenLogLevel(level)
				)
			})
	})
)

export default PrintRefsLive
