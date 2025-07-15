import {
	type Effect,
	all as effectAll,
	gen as effectGen,
	whenLogLevel as effectWhenLogLevel,
	logWithLevel as effectLogWithLevel,
} from "effect/Effect"
import { pipe } from "effect/Function"
import { fromLiteral as logLevelFromLiteral } from "effect/LogLevel"
import type { Literal as LogLevelLiteral } from "effect/LogLevel"
import Print from "./print.service.ts"
import { type REF_TYPE, TAG, BRANCH } from "./reference.entity.ts"

interface Arguments {
	level: Exclude<LogLevelLiteral, "None" | "All">
	message: string
	repoDirectory: string
}

/**
 * Prints the refs of the current git repository.
 * @param args - Context object
 * @param args.repoDirectory - Repo directory
 * @param args.level - Log level
 * @param args.message - Log message header
 * @returns - A promise that resolves when the refs are printed
 */
const print = ({ message, repoDirectory, level }: Arguments): Effect<void, never, Print> =>
	effectGen(function* () {
		const command = yield* Print

		const doPrint = (type: REF_TYPE) => command({ repoDirectory, type })

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
