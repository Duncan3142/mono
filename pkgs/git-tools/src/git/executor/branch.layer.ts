import { CommandExecutor } from "@effect/platform"
import { Layer, Effect, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { BranchExecutor } from "#duncan3142/git-tools/core/executor"
import { BranchMode } from "#duncan3142/git-tools/core/domain"

const Live: Layer.Layer<BranchExecutor.BranchExecutor, never, CommandExecutor.CommandExecutor> =
	Layer.effect(
		BranchExecutor.BranchExecutor,
		Effect.gen(function* () {
			const executor = yield* CommandExecutor.CommandExecutor

			return ({
				mode,
				directory,
				timeout,
			}: BranchExecutor.Arguments): Effect.Effect<
				void,
				CommandError.CommandFailed | CommandError.CommandTimeout
			> => {
				const args = BranchMode.$match(mode, {
					Print: () => [Base.NO_PAGER, "-a", "-v", "-v"],
				})
				return Base.make({
					directory,

					command: "branch",
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
