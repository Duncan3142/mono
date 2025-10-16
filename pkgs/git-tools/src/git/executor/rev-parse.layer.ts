import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Chunk, Stream } from "effect"
import * as Base from "./base.ts"
import { RevParseExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"

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
			CommandError.CommandFailed | CommandError.CommandTimeout
		> =>
			Base.make({
				directory,
				command: "rev-parse",
				args: [rev],
				timeout,
				errorMatcher: Match.value,
			}).pipe(
				Effect.andThen(Stream.runCollect),
				Effect.map(Chunk.join("")),
				Effect.scoped,
				Effect.provideService(CommandExecutor.CommandExecutor, executor)
			)
	})
)

export { Live }
