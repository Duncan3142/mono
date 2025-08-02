import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Effect, Match, pipe, Layer } from "effect"
import commandFactory, { type ErrorCode } from "./command.ts"
import { FetchRefsNotFoundError } from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { toStrings as refSpecToStrings } from "#domain/reference-spec"
import type { Arguments } from "#command/fetch-executor.service"
import RepositoryConfig from "#config/repository-config.service"
import { FETCH_MODE_DEEPEN_BY, FETCH_MODE_DEPTH } from "#domain/fetch-reference"
import FetchCommandExecutor from "#command/fetch-executor.service"

const FETCH_NOT_FOUND_CODE = 128

const FetchCommandExecutorLive: Layer.Layer<
	FetchCommandExecutor,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	FetchCommandExecutor,
	Effect.gen(function* () {
		const { directory: repoDirectory } = yield* RepositoryConfig
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			mode: { mode, value: modeValue },
			remote,
			refs,
		}: Arguments): Effect.Effect<void, FetchRefsNotFoundError> =>
			Effect.gen(function* () {
				const { remote: remoteName, refs: refStrings } = refSpecToStrings({
					remote,
					refs,
				})

				const modeValueString = modeValue.toString(BASE_10_RADIX)

				const modeArg = pipe(
					Match.value(mode),
					Match.when(FETCH_MODE_DEPTH, () => `--depth=${modeValueString}`),
					Match.when(FETCH_MODE_DEEPEN_BY, () => `--deepen=${modeValueString}`),
					Match.exhaustive
				)

				const subCommand = "fetch"
				const subArgs = [modeArg, remoteName, ...refStrings]
				const timeout: Duration.DurationInput = "8 seconds"

				return yield* pipe(
					commandFactory({
						directory: repoDirectory,
						subCommand,
						subArgs,
						timeout,
						errorMatcher: (errorCode: ErrorCode) =>
							pipe(
								Match.value(errorCode),
								Match.when(FETCH_NOT_FOUND_CODE, () =>
									Effect.fail(
										new FetchRefsNotFoundError({
											references: refStrings,
										})
									)
								)
							),
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default FetchCommandExecutorLive
