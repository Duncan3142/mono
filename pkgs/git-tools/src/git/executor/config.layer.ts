import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { ConfigExecutor } from "#duncan3142/git-tools/core/executor"
import {
	type GitCommandError,
	ConfigMode,
	ConfigScope,
} from "#duncan3142/git-tools/core/domain"

const Live: Layer.Layer<ConfigExecutor.ConfigExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		ConfigExecutor.ConfigExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				mode,
				scope,
				timeout,
			}: ConfigExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const scopeArgs = ConfigScope.$match(scope, {
					Global: () => ["--global"],
					Local: () => [],
				})
				const modeArgs = ConfigMode.$match(mode, {
					Set: ({ key, value }) => [key, value],
					Add: ({ key, value }) => ["--add", key, value],
					List: () => ["--list"],
				})
				return Base.make({
					directory,
					command: "config",
					args: [...scopeArgs, ...modeArgs],
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
