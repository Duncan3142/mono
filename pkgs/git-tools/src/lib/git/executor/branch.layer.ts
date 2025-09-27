import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { BranchExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { type GitCommandError, BranchMode } from "#duncan3142/git-tools/lib/core/domain"

const Live: Layer.Layer<BranchExecutor.BranchExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		BranchExecutor.BranchExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				directory,
				timeout,
			}: BranchExecutor.Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const subArgs = BranchMode.$match(mode, {
					Print: () => ["-a", "-v", "-v"],
				})
				return Base.make({
					directory,
					noPager: true,
					subCommand: "branch",
					subArgs,
					timeout,
					errorMatcher: Match.value,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
