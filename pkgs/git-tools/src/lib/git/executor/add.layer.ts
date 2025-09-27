import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { AddExecutor } from "#duncan3142/git-tools/lib/core/executor"
import type { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"

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
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> =>
				Base.make({
					directory,
					subCommand: "add",
					subArgs: ["."],
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
