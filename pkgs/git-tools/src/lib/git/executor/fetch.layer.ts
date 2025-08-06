import { CommandExecutor } from "@effect/platform"
import { Effect, Match, pipe, Layer, Console, Array } from "effect"
import commandFactory, { type ErrorCode } from "./base.ts"
import { FetchRefsNotFoundError } from "#domain/fetch.error"
import { BASE_10_RADIX } from "#const"
import { ReferenceSpec, toString as refSpecToString } from "#domain/reference-spec"
import type { Arguments } from "#executor/fetch.service"
import { FETCH_DEEPEN_BY_TAG, FETCH_DEPTH_TAG } from "#domain/fetch"
import FetchExecutor from "#executor/fetch.service"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

const FETCH_NOT_FOUND_CODE = 128

const FetchExecutorLive: Layer.Layer<FetchExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		FetchExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				remote,
				refs,
				directory,
				timeout,
			}: Arguments): Effect.Effect<
				void,
				FetchRefsNotFoundError | GitCommandFailedError | GitCommandTimeoutError
			> =>
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

export default FetchExecutorLive
