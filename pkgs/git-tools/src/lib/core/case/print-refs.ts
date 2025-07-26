import {
	type Effect,
	all as effectAll,
	gen as effectGen,
	whenLogLevel as effectWhenLogLevel,
	logWithLevel as effectLogWithLevel,
} from "effect/Effect"
import { pipe } from "effect/Function"
import { fromLiteral as logLevelFromLiteral } from "effect/LogLevel"
import type { Arguments } from "./print-refs.service.ts"
import { type REF_TYPE, TAG, BRANCH } from "#domain/reference"
import PrintRefsCommand from "#command/print-refs.service"

/**
 * Prints the refs of the current git repository.
 * @param args - Context object
 * @param args.level - Log level
 * @param args.message - Log message header
 * @returns - A promise that resolves when the refs are printed
 */
const print = ({ message, level }: Arguments): Effect<void, never, PrintRefsCommand> =>
	effectGen(function* () {
		const command = yield* PrintRefsCommand

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

export default print
export type { Arguments }
