import { CommandExecutor } from "@effect/platform"
import { Effect, Match, pipe, Layer, Array, Stream } from "effect"
import { type CommandError, Radix } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { ReferenceSpec, FetchError, FetchMode } from "#duncan3142/git-tools/core/domain"
import { FetchExecutor } from "#duncan3142/git-tools/core/executor"

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
				FetchError.FetchRefsNotFound | CommandError.CommandFailed | CommandError.CommandTimeout
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

				const command = "fetch"
				const args = [modeArg, remoteName, ...refStrings]

				return Base.make({
					directory,
					command,
					args,
					timeout,
					errorMatcher: ({ exitCode }) =>
						pipe(
							Match.value(exitCode),
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
