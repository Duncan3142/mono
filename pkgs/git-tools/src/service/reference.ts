import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import {
	type Effect,
	all as effectAll,
	fail as effectFail,
	flatMap as effectFlatMap,
	void as effectVoid,
	whenLogLevel as effectWhenLogLevel,
	logWithLevel as effectLogWithLevel,
} from "effect/Effect"
import { pipe } from "effect/Function"
import {
	fromLiteral as logLevelFromLiteral,
	type Literal as LogLevelLiteral,
} from "effect/LogLevel"
import { LogReferencesError, BRANCH, type REF_TYPE } from "#domain/reference"
import command, { SUCCESS_CODE } from "#command/reference"

interface Arguments {
	level: LogLevelLiteral
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
const logReferences = ({
	message,
	repoDirectory,
	level,
}: Arguments): Effect<void, PlatformError | LogReferencesError, CommandExecutor> => {
	const doPrint = (type: REF_TYPE) =>
		pipe(
			command({ repoDirectory, type }),
			effectFlatMap((code) =>
				code === SUCCESS_CODE ? effectVoid : effectFail(new LogReferencesError())
			)
		)

	return pipe(
		effectAll(
			[
				effectLogWithLevel(logLevelFromLiteral(level), message),
				doPrint(BRANCH),
				doPrint("tag"),
			],
			{
				discard: true,
			}
		),
		effectWhenLogLevel(level)
	)
}

export default logReferences
