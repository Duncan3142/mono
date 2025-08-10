import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { RevParseExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"

const Live: Layer.Layer<
	RevParseExecutor.RevParseExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	RevParseExecutor.RevParseExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: rev },
			directory,
			timeout,
		}: RevParseExecutor.Arguments): Effect.Effect<
			string,
			GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
		> =>
			Base.make({
				directory,
				subCommand: "rev-parse",
				subArgs: [rev],
				timeout,
				errorMatcher: Match.value,
			}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
	})
)

export { Live }
