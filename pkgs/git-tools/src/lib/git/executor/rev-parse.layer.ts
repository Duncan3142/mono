import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { RevParse } from "#executor"
import { GitCommandError } from "#domain"

const Live: Layer.Layer<RevParse.Tag, never, CommandExecutor.CommandExecutor> = Layer.effect(
	RevParse.Tag,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: rev },
			directory,
			timeout,
		}: RevParse.Arguments): Effect.Effect<
			string,
			GitCommandError.Failed | GitCommandError.Timeout
		> => {
			return Base.make({
				directory,
				subCommand: "rev-parse",
				subArgs: [rev],
				timeout,
				errorMatcher: Match.value,
			}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
		}
	})
)

export { Live }
