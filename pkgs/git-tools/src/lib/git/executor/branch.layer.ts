import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match, Console } from "effect"
import * as Base from "./base.ts"
import { Branch, BranchMode } from "#executor"
import { GitCommandError } from "#domain"

const Live: Layer.Layer<Branch.Tag, never, CommandExecutor.CommandExecutor> = Layer.effect(
	Branch.Tag,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			mode,
			directory,
			timeout,
		}: Branch.Arguments): Effect.Effect<
			void,
			GitCommandError.Failed | GitCommandError.Timeout
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
				Effect.flatMap(Console.log),
				Effect.scoped,
				Effect.provideService(CommandExecutor.CommandExecutor, executor)
			)
		}
	})
)

export { Live }
