import { CommandExecutor } from "@effect/platform"
import { Console, Layer, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { ResetExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, ResetMode } from "#duncan3142/git-tools/domain"

const Live: Layer.Layer<ResetExecutor.ResetExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		ResetExecutor.ResetExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				ref: { name: ref },
				directory,
				mode,
				timeout,
			}: ResetExecutor.Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const modeArg = ResetMode.$match(mode, {
					Hard: () => "--hard",
					Mixed: () => "--mixed",
					Soft: () => "--soft",
				})

				return Base.make({
					directory,
					subCommand: "reset",
					subArgs: [modeArg, ref],
					timeout,
					errorMatcher: Match.value,
				}).pipe(
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
