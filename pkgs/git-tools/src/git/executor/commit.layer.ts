import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { CommitExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"

const Live: Layer.Layer<CommitExecutor.CommitExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		CommitExecutor.CommitExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				timeout,
				message,
			}: CommitExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> =>
				Base.make({
					directory,
					command: "commit",
					args: ["-m", message],
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
