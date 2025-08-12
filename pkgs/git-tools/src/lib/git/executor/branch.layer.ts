import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { BranchExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, BranchMode } from "#duncan3142/git-tools/domain"

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
				return pipe(
					Base.make({
						directory,
						noPager: true,
						subCommand: "branch",
						subArgs,
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.asVoid,
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
