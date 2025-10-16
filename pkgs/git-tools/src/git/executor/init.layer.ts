import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { InitExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"

const Live: Layer.Layer<InitExecutor.InitExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		InitExecutor.InitExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				bare,
				timeout,
				initBranch,
			}: InitExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const bareArg = bare ? ["--bare"] : []
				return Base.make({
					directory,
					command: "init",
					args: [...bareArg, `--initial-branch=${initBranch}`],
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
