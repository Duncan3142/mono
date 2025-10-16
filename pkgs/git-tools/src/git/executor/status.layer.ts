import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { StatusExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"

const Live: Layer.Layer<StatusExecutor.StatusExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		StatusExecutor.StatusExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				directory,
				timeout,
			}: StatusExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> =>
				Base.make({
					directory,
					command: "status",
					timeout,
					errorMatcher: Match.value,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
		})
	)

export { Live }
