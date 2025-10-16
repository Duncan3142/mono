import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { PushExecutor } from "#duncan3142/git-tools/core/executor"
import type { CommandError } from "@duncan3142/effect"

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
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const fwl = forceWithLease ? ["--force-with-lease"] : []
				return Base.make({
					directory,
					command: "push",
					args: [...fwl, remote, ref],
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
