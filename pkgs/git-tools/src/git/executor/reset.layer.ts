import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { ResetExecutor } from "#duncan3142/git-tools/core/executor"
import { ResetMode } from "#duncan3142/git-tools/core/domain"

const Live: Layer.Layer<ResetExecutor.ResetExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		ResetExecutor.ResetExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				ref: { name: ref },
				directory,
				mode,
				timeout,
			}: ResetExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const modeArg = ResetMode.$match(mode, {
					Hard: () => "--hard",
					Mixed: () => "--mixed",
					Soft: () => "--soft",
				})

				return Base.make({
					directory,
					command: "reset",
					args: [modeArg, ref],
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
