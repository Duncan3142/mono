import { CommandExecutor } from "@effect/platform"
import { Console, Layer, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { Reset, ResetMode } from "#executor"
import { GitCommandError } from "#domain"

const Live: Layer.Layer<Reset.Tag, never, CommandExecutor.CommandExecutor> = Layer.effect(
	Reset.Tag,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: ref },
			directory,
			mode,
			timeout,
		}: Reset.Arguments): Effect.Effect<
			void,
			GitCommandError.Failed | GitCommandError.Timeout
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
