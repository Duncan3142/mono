import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Effect, Match, pipe, Layer, Console, Array } from "effect"
import commandFactory, { type ErrorCode } from "./command.ts"
import { FetchRefsNotFoundError } from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { ReferenceSpec, toString as refSpecToString } from "#domain/reference-spec"
import type { Arguments } from "#command/fetch-executor.service"
import { FETCH_DEEPEN_BY_TAG, FETCH_DEPTH_TAG } from "#domain/fetch"
import FetchCommandExecutor from "#command/fetch-executor.service"

const FETCH_NOT_FOUND_CODE = 128

const FetchCommandExecutorLive: Layer.Layer<
	FetchCommandExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	FetchCommandExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			mode,
			remote,
			refs,
			directory,
		}: Arguments): Effect.Effect<void, FetchRefsNotFoundError> =>
			Effect.gen(function* () {
				const { name: remoteName } = remote
				const refStrings = pipe(
					refs,
					Array.map((ref) => refSpecToString(ReferenceSpec({ ref, remote })))
				)

				const numberToString = (num: number) => num.toString(BASE_10_RADIX)

				const modeArg = pipe(
					Match.value(mode),
					Match.when(
						{ _tag: FETCH_DEEPEN_BY_TAG },
						({ deepenBy }) => `--depth=${numberToString(deepenBy)}`
					),
					Match.when(
						{ _tag: FETCH_DEPTH_TAG },
						({ depth }) => `--deepen=${numberToString(depth)}`
					),
					Match.exhaustive
				)

				const subCommand = "fetch"
				const subArgs = [modeArg, remoteName, ...refStrings]
				const timeout: Duration.DurationInput = "8 seconds"

				return yield* pipe(
					commandFactory({
						directory,
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
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default FetchCommandExecutorLive
