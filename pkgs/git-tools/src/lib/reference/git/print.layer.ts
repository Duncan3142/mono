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
import { PrintReferencesError, PrintReferencesTimeoutError } from "#reference/core/print.error"
import Print, { type Arguments } from "#reference/core/print.service"

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
			onTimeout: () => new PrintReferencesTimeoutError(),
		}),
		effectOrDie,
		effectFlatMap((code) =>
			pipe(
				matchValue(code),
				matchWhen(SUCCESS_CODE, () => effectVoid),
				matchOrElse(() => effectDie(new PrintReferencesError()))
			)
		)
	)
}

const PrintCommandLive: Layer<Print, never, CommandExecutor> = layerEffect(
	Print,
	effectGen(function* () {
		const executor = yield* CommandExecutor

		return {
			exec: (args: Arguments) =>
				pipe(command(args), effectProvideService(CommandExecutor, executor)),
		}
	})
)

export default PrintCommandLive
export { command }
