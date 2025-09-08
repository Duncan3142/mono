import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { RemoteExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { type GitCommandError, RemoteMode } from "#duncan3142/git-tools/lib/core/domain"

const Live: Layer.Layer<RemoteExecutor.RemoteExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		RemoteExecutor.RemoteExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				timeout,
				mode,
			}: RemoteExecutor.Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const subArgs = RemoteMode.$match(mode, {
					Add: ({ remote: { name, url } }) => ["add", name, url],
				})
				return Base.make({
					directory,
					subCommand: "remote",
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
