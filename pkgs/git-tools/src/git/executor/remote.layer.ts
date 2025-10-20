import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { RemoteExecutor } from "#duncan3142/git-tools/core/executor"
import { RemoteMode } from "#duncan3142/git-tools/core/domain"

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
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const args = RemoteMode.$match(mode, {
					Add: ({ remote: { name, url } }) => ["add", name, url],
				})
				return Base.make({
					directory,
					command: "remote",
					args,
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
