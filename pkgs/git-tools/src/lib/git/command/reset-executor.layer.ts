import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Console, Layer, pipe, Effect, Match } from "effect"
import commandFactory from "./command.ts"
import ResetCommandExecutor, { type Arguments } from "#command/reset-executor.service"
import { RESET_MODE_HARD, RESET_MODE_MIXED, RESET_MODE_SOFT } from "#domain/reset"

const ResetCommandExecutorLive: Layer.Layer<
	ResetCommandExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	ResetCommandExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({ ref, directory, mode }: Arguments): Effect.Effect<void> =>
			Effect.gen(function* () {
				const modeArg = Match.value(mode).pipe(
					Match.when(RESET_MODE_HARD, () => "--hard"),
					Match.when(RESET_MODE_MIXED, () => "--mixed"),
					Match.when(RESET_MODE_SOFT, () => "--soft"),
					Match.exhaustive
				)
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "reset",
						subArgs: [modeArg, ref.name],
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.scoped,
					Console.log,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default ResetCommandExecutorLive
