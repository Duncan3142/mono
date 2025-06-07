import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import {
	type Effect,
	all,
	fail,
	flatMap,
	void as asVoid,
	whenLogLevel,
	logWithLevel,
} from "effect/Effect"
import { pipe } from "effect/Function"
import { fromLiteral, type Literal as LogLevel } from "effect/LogLevel"
import { LogReferencesError, BRANCH, type REF_TYPE } from "#domain/reference"
import { command, SUCCESS_CODE } from "#command/reference"

interface Arguments {
	level: LogLevel
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
			flatMap((code) => (code === SUCCESS_CODE ? asVoid : fail(new LogReferencesError())))
		)

	return pipe(
		all([logWithLevel(fromLiteral(level), message), doPrint(BRANCH), doPrint("tag")], {
			discard: true,
		}),
		whenLogLevel(level)
	)
}

export default logReferences
