import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match } from "effect"
import commandFactory from "./base.ts"
import RevParseExecutor, { type Arguments } from "#executor/rev-parse.service"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

const RevParseExecutorLive: Layer.Layer<
	RevParseExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	RevParseExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: rev },
			directory,
			timeout,
		}: Arguments): Effect.Effect<string, GitCommandFailedError | GitCommandTimeoutError> =>
			Effect.gen(function* () {
				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "rev-parse",
						subArgs: [rev],
						timeout,
						errorMatcher: Match.value,
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default RevParseExecutorLive
