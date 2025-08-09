import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match, Console } from "effect"
import * as Base from "./base.ts"
import * as BranchExecutor from "#executor/branch.tag"
import * as GitCommandError from "#domain/git-command.error"

const Live: Layer.Layer<BranchExecutor.Tag, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		BranchExecutor.Tag,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				directory,
				timeout,
			}: BranchExecutor.Arguments): Effect.Effect<
				void,
				GitCommandError.Failed | GitCommandError.Timeout
			> => {
				const subArgs = BranchExecutor.Mode.$match(mode, {
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
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
