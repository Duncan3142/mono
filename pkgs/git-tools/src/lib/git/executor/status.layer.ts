import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { StatusExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"

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
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> =>
				Base.make({
					directory,
					subCommand: "status",
					timeout,
					errorMatcher: Match.value,
					stdoutHandler: Stream.runDrain,
				}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
		})
	)

export { Live }
