import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import { CommandErrorMatcher, type CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { CommitExecutor } from "#duncan3142/git-tools/core/executor"

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
					errorMatcher: CommandErrorMatcher.noOp,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
		})
	)

export { Live }
