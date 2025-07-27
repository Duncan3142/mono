import { Command, CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Effect, Match, Stream, pipe, Layer, Console } from "effect"
import { FetchRefsNotFoundError } from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { toStrings as refSpecToStrings } from "#domain/reference-spec"
import type { Arguments } from "#command/fetch.service"
import FetchCommand, { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH } from "#command/fetch.service"
import RepositoryConfig from "#config/repository-config.service"
import { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

const FETCH_SUCCESS_CODE = 0
const FETCH_NOT_FOUND_CODE = 128

const FetchCommandLive: Layer.Layer<
	FetchCommand,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	FetchCommand,
	Effect.gen(function* () {
		const { directory: repoDirectory } = yield* RepositoryConfig
		const executor = yield* CommandExecutor.CommandExecutor

		return ({ mode, remote, refs }: Arguments): Effect.Effect<void, FetchRefsNotFoundError> =>
			Effect.gen(function* () {
				const { remote: remoteName, refs: refStrings } = refSpecToStrings({
					remote,
					refs,
				})

				const modeValueString = (modeValue: number) => modeValue.toString(BASE_10_RADIX)

				const modeArg = pipe(
					Match.value(mode),
					Match.when(
						{ mode: FETCH_MODE_DEPTH },
						({ value }) => `--depth=${modeValueString(value)}`
					),
					Match.when(
						{ mode: FETCH_MODE_DEEPEN_BY },
						({ value }) => `--deepen=${modeValueString(value)}`
					),
					Match.exhaustive
				)

				const subCommand = "fetch"
				const subArgs = [modeArg, remoteName, ...refStrings]
				const timeout: Duration.DurationInput = "8 seconds"

				return yield* pipe(
					Command.make("git", subCommand, ...subArgs),
					Command.workingDirectory(repoDirectory),
					Command.stdout("pipe"),
					Command.stderr("pipe"),
					Command.start,
					Effect.orDie,
					Effect.flatMap(({ exitCode, stdout, stderr }) => {
						const result = pipe(
							exitCode,
							Effect.timeoutFail({
								duration: timeout,
								onTimeout: () =>
									new GitCommandTimeoutError({
										timeout,
										command: subCommand,
										args: subArgs,
									}),
							}),
							Effect.orDie,
							Effect.flatMap((code) =>
								pipe(
									Match.value(code),
									Match.when(FETCH_SUCCESS_CODE, () => Effect.void),
									Match.when(FETCH_NOT_FOUND_CODE, () =>
										Effect.fail(
											new FetchRefsNotFoundError({
												references: refStrings,
											})
										)
									),
									Match.orElse((errorCode) =>
										Effect.die(
											new GitCommandFailedError({
												exitCode: errorCode,
												command: subCommand,
												args: subArgs,
											})
										)
									)
								)
							)
						)
						return Effect.all(
							[
								result,
								pipe(stdout, Stream.decodeText(), Stream.runForEach(Console.log), Effect.orDie),
								pipe(
									stderr,
									Stream.decodeText(),
									Stream.runForEach(Console.error),
									Effect.orDie
								),
							],
							{ concurrency: "unbounded", discard: true }
						)
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default FetchCommandLive
