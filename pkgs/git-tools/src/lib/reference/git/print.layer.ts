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
	all as effectAll,
} from "effect/Effect"
import { log as consoleLog, error as consoleError } from "effect/Console"
import { decodeText, runForEach as streamRunForEach } from "effect/Stream"
import {
	value as matchValue,
	when as matchWhen,
	orElse as matchOrElse,
	exhaustive as matchExhaustive,
} from "effect/Match"
import {
	make as commandMake,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
	start as commandStart,
} from "@effect/platform/Command"
import { Scope } from "effect/Scope"
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
const command = ({
	repoDirectory,
	type,
}: Arguments): Effect<void, never, CommandExecutor | Scope> => {
	const args = pipe(
		matchValue(type),
		matchWhen(BRANCH, () => ["branch", "-a", "-v", "-v"]),
		matchWhen(TAG, () => ["tag"]),
		matchExhaustive
	)
	return pipe(
		commandMake("git", "--no-pager", ...args),
		commandWorkDir(repoDirectory),
		commandStdout("pipe"),
		commandStderr("pipe"),
		commandStart,
		effectOrDie,
		effectFlatMap(({ exitCode, stdout, stderr }) =>
			effectAll(
				[
					pipe(
						exitCode,
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
					),
					pipe(stdout, decodeText(), streamRunForEach(consoleLog), effectOrDie),
					pipe(stderr, decodeText(), streamRunForEach(consoleError), effectOrDie),
				],
				{ discard: true, concurrency: 3 }
			)
		)
	)
}

const PrintCommandLive: Layer<Print, never, CommandExecutor | Scope> = layerEffect(
	Print,
	effectGen(function* () {
		const [executor, scope] = yield* effectAll([CommandExecutor, Scope], {
			concurrency: 2,
		})

		return (args: Arguments) =>
			pipe(
				command(args),
				effectProvideService(CommandExecutor, executor),
				effectProvideService(Scope, scope)
			)
	})
)

export default PrintCommandLive
export { command }
