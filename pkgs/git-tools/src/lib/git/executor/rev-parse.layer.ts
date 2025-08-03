import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Layer, pipe, Effect, Match } from "effect"
import commandFactory from "./base.ts"
import RevParseExecutor, { type Arguments } from "#executor/rev-parse.service"

const RevParseExecutorLive: Layer.Layer<
	RevParseExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	RevParseExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({ rev: { name: rev }, directory }: Arguments): Effect.Effect<string> =>
			Effect.gen(function* () {
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "rev-parse",
						subArgs: [rev],
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default RevParseExecutorLive
