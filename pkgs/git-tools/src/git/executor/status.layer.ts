import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { StatusExecutor } from "#duncan3142/git-tools/core/executor"

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
					errorMatcher: Base.errorMatcherNoOp,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
		})
	)

export { Live }
