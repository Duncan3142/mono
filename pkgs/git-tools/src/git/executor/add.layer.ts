import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { AddExecutor } from "#duncan3142/git-tools/core/executor"

const Live: Layer.Layer<AddExecutor.AddExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		AddExecutor.AddExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				timeout,
			}: AddExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> =>
				Base.make({
					directory,
					command: "add",
					args: ["."],
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
