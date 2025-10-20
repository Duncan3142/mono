import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { InitExecutor } from "#duncan3142/git-tools/core/executor"

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
					errorMatcher: Base.errorMatcherNoOp,
				}).pipe(
					Effect.andThen(Stream.runDrain),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			}
		})
	)

export { Live }
