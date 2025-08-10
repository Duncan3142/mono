import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Console } from "effect"
import * as Base from "./base.ts"
import { PushExecutor } from "#duncan3142/git-tools/executor"
import type { GitCommandError } from "#duncan3142/git-tools/domain"

const Live: Layer.Layer<PushExecutor.PushExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		PushExecutor.PushExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor
			return ({
				directory,
				ref: { name: ref },
				remote: { name: remote },
				forceWithLease,
				timeout,
			}: PushExecutor.Arguments): Effect.Effect<
				void,
				GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout
			> => {
				const fwl = forceWithLease ? ["--force-with-lease"] : []
				return Base.make({
					directory,
					subCommand: "push",
					subArgs: [...fwl, remote, ref],
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
