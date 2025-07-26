import {
	make as commandMake,
	start as commandStart,
	stdout as commandStdout,
	workingDirectory as commandWorkDir,
	stderr as commandStderr,
} from "@effect/platform/Command"
import {
	type Effect,
	flatMap as effectFlatMap,
	void as effectVoid,
	fail as effectFail,
	orDie as effectOrDie,
	die as effectDie,
	timeoutFail as effectTimeoutFail,
	all as effectAll,
	provideService as effectProvideService,
	gen as effectGen,
	scoped as effectScoped,
} from "effect/Effect"
import { decodeText, runForEach as streamRunForEach } from "effect/Stream"
import { pipe } from "effect/Function"
import { value as matchValue, when as matchWhen, orElse as matchOrElse } from "effect/Match"
import { CommandExecutor } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { log as consoleLog, error as consoleError } from "effect/Console"
import {
	FetchFailedError,
	FetchReferenceNotFoundError,
	FetchTimeoutError,
} from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { toStrings as refSpecToStrings } from "#domain/reference-spec"
import type { Arguments } from "#command/fetch.service"
import FetchCommand from "#command/fetch.service"

const FETCH_SUCCESS_CODE = 0
const FETCH_NOT_FOUND_CODE = 128

/**
 * Fetches the specified ref specs from the remote repository
 * @param props - The properties for the fetch operation
 * @param props.repoDir - The directory of the repository
 * @param props.depth - The depth of the fetch operation
 * @param props.deepen - Whether to deepen the fetch
 * @param props.refSpecs - The ref specs to fetch
 * @returns An Effect that resolves to void or FetchNotFoundError
 */
const command = ({
	repoDir,
	depth,
	deepen,
	refSpecs,
}: Arguments): Effect<void, FetchReferenceNotFoundError, CommandExecutor> => {
	const { remote, refs } = refSpecToStrings(refSpecs)

	const depthString = depth.toString(BASE_10_RADIX)

	const depthArgument = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	return pipe(
		commandMake("git", "fetch", depthArgument, remote, ...refs),
		commandWorkDir(repoDir),
		commandStdout("pipe"),
		commandStderr("pipe"),
		commandStart,
		effectScoped,
		effectOrDie,
		effectFlatMap(({ exitCode, stdout, stderr }) => {
			const result = pipe(
				exitCode,
				effectTimeoutFail({
					duration: "8 seconds",
					onTimeout: () => new FetchTimeoutError(),
				}),
				effectOrDie,
				effectFlatMap((code) =>
					pipe(
						matchValue(code),
						matchWhen(FETCH_SUCCESS_CODE, () => effectVoid),
						matchWhen(FETCH_NOT_FOUND_CODE, () =>
							effectFail(new FetchReferenceNotFoundError())
						),
						matchOrElse(() => effectDie(new FetchFailedError()))
					)
				)
			)
			return effectAll(
				[
					result,
					pipe(stdout, decodeText(), streamRunForEach(consoleLog), effectOrDie),
					pipe(stderr, decodeText(), streamRunForEach(consoleError), effectOrDie),
				],
				{ concurrency: "unbounded", discard: true }
			)
		})
	)
}

const FetchCommandLive: Layer<FetchCommand, never, CommandExecutor> = layerEffect(
	FetchCommand,
	effectGen(function* () {
		const executor = yield* CommandExecutor

		return (args: Arguments) =>
			pipe(command(args), effectProvideService(CommandExecutor, executor))
	})
)

export default FetchCommandLive
export { command }
