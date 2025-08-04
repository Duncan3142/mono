import { CommandExecutor } from "@effect/platform"
import { Console, Layer, pipe, Effect, Match } from "effect"
import commandFactory from "./base.ts"
import ResetExecutor, { type Arguments } from "#executor/reset.service"
import { RESET_MODE_HARD, RESET_MODE_MIXED, RESET_MODE_SOFT } from "#domain/reset"

const ResetExecutorLive: Layer.Layer<ResetExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		ResetExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({ ref, directory, mode, timeout }: Arguments): Effect.Effect<void> =>
				Effect.gen(function* () {
					const modeArg = Match.value(mode).pipe(
						Match.when(RESET_MODE_HARD, () => "--hard"),
						Match.when(RESET_MODE_MIXED, () => "--mixed"),
						Match.when(RESET_MODE_SOFT, () => "--soft"),
						Match.exhaustive
					)

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

export default ResetExecutorLive
