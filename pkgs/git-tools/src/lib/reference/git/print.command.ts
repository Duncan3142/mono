import { CommandExecutor } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { pipe } from "effect/Function"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	die as effectDie,
	orDie as effectOrDie,
	gen as effectGen,
	timeoutFail as effectTimeoutFail,
	provideService as effectProvideService,
} from "effect/Effect"
import {
	value as matchValue,
	when as matchWhen,
	orElse as matchOrElse,
	exhaustive as matchExhaustive,
} from "effect/Match"
import {
	make as commandMake,
	exitCode as commandExitCode,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import { BRANCH, TAG } from "#reference/core/reference.entity"
import { LogReferencesError, LogReferencesTimeoutError } from "#reference/core/print.error"
import PrintCommand, { type Arguments } from "#reference/core/print.command"

const SUCCESS_CODE = 0

/**
 * Lists the references (branches or tags) in a git repository.
 * @param args - The arguments for the command
 * @param args.repoDirectory - The directory of the repository
 * @param args.type - The type of references to list (branch or tag)
 * @returns An Effect that executes the git command to list references
 */
const command = ({ repoDirectory, type }: Arguments): Effect<void, never, CommandExecutor> => {
	const args = pipe(
		matchValue(type),
		matchWhen(BRANCH, () => ["branch", "-a", "-v", "-v"]),
		matchWhen(TAG, () => ["tag"]),
		matchExhaustive
	)
	return pipe(
		commandMake("git", "--no-pager", ...args),
		commandWorkDir(repoDirectory),
		commandStdout("inherit"),
		commandStderr("inherit"),
		commandExitCode,

		effectTimeoutFail({
			duration: "2 seconds",
			onTimeout: () => new LogReferencesTimeoutError(),
		}),
		effectOrDie,
		effectFlatMap((code) =>
			pipe(
				matchValue(code),
				matchWhen(SUCCESS_CODE, () => effectVoid),
				matchOrElse(() => effectDie(new LogReferencesError()))
			)
		)
	)
}

const PrintCommandLive: Layer<PrintCommand, never, CommandExecutor> = layerEffect(
	PrintCommand,
	effectGen(function* () {
		const executor = yield* CommandExecutor

		return {
			exec: (args: Arguments) => effectProvideService(command(args), CommandExecutor, executor),
		}
	})
)

export default command
export { PrintCommandLive }
