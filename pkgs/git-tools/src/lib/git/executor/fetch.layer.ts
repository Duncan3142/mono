import { CommandExecutor } from "@effect/platform"
import { Effect, Match, pipe, Layer, Array, Stream } from "effect"
import { Radix } from "@duncan3142/effect"
import * as Base from "./base.ts"
import {
	type GitCommandError,
	ReferenceSpec,
	FetchError,
	FetchMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { FetchExecutor } from "#duncan3142/git-tools/lib/core/executor"

const FETCH_NOT_FOUND_CODE = 128

const Live: Layer.Layer<FetchExecutor.FetchExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		FetchExecutor.FetchExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				remote,
				refs,
				directory,
				timeout,
			}: FetchExecutor.Arguments): Effect.Effect<
				void,
				| FetchError.FetchRefsNotFound
				| GitCommandError.GitCommandFailed
				| GitCommandError.GitCommandTimeout
			> => {
				const { name: remoteName } = remote
				const refStrings = pipe(
					refs,
					Array.map((ref) =>
						ReferenceSpec.toString(ReferenceSpec.ReferenceSpec({ ref, remote }))
					)
				)

				const numberToString = (num: number) => num.toString(Radix.BASE_10)

				const modeArg = FetchMode.$match(mode, {
					DeepenBy: ({ deepenBy }) => `--deepen=${numberToString(deepenBy)}`,
					Depth: ({ depth }) => `--depth=${numberToString(depth)}`,
				})

				const subCommand = "fetch"
				const subArgs = [modeArg, remoteName, ...refStrings]

				return Base.make({
					directory,
					subCommand,
					subArgs,
					timeout,
					errorMatcher: (errorCode: Base.ErrorCode) =>
						pipe(
							Match.value(errorCode),
							Match.when(FETCH_NOT_FOUND_CODE, () =>
								Effect.fail(
									new FetchError.FetchRefsNotFound({
										references: refStrings,
									})
								)
							)
						),
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
