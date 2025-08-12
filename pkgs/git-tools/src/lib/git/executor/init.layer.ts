import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { InitExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"

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
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const bareArg = bare ? ["--bare"] : []
				return Base.make({
					directory,
					subCommand: "init",
					subArgs: [...bareArg, `--initial-branch=${initBranch}`],
					timeout,
					errorMatcher: Match.value,
				}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
			}
		})
	)

export { Live }
