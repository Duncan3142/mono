import { CommandExecutor } from "@effect/platform"
import type { Array, Duration } from "effect"
import { Layer, pipe, Effect, Match, Console } from "effect"
import commandFactory from "./base.ts"
import { BRANCH, TAG } from "#domain/reference"
import PrintRefsExecutor, { type Arguments } from "#executor/print-refs.service"

const PrintRefsExecutorLive: Layer.Layer<
	PrintRefsExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	PrintRefsExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({ type, directory }: Arguments): Effect.Effect<void> =>
			Effect.gen(function* () {
				const args = pipe(
					Match.value(type),
					Match.when(
						BRANCH,
						(): Array.NonEmptyReadonlyArray<string> => ["branch", "-a", "-v", "-v"]
					),
					Match.when(TAG, (): Array.NonEmptyReadonlyArray<string> => ["tag"]),
					Match.exhaustive
				)
				const [subCommand, ...subArgs] = args
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand,
						subArgs,
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default PrintRefsExecutorLive
