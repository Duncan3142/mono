import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match, Stream } from "effect"
import * as Base from "./base.ts"
import { CheckoutExecutor } from "#duncan3142/git-tools/core/executor"
import {
	type GitCommandError,
	CheckoutError,
	CheckoutMode,
} from "#duncan3142/git-tools/core/domain"

const CHECKOUT_REF_NOT_FOUND_CODE = 1

const Live: Layer.Layer<
	CheckoutExecutor.CheckoutExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	CheckoutExecutor.CheckoutExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: ref },
			directory,
			mode,
			timeout,
		}: CheckoutExecutor.Arguments): Effect.Effect<
			void,
			| CheckoutError.CheckoutRefNotFound
			| GitCommandError.GitCommandFailed
			| GitCommandError.GitCommandTimeout
		> => {
			const createBranchArg = CheckoutMode.$match(mode, {
				Create: () => ["-b"],
				Standard: () => [],
			})

			return Base.make({
				directory,
				command: "checkout",
				args: ["--progress", ...createBranchArg, ref],
				timeout,
				errorMatcher: (errorCode: Base.ErrorCode) =>
					pipe(
						Match.value(errorCode),
						Match.when(CHECKOUT_REF_NOT_FOUND_CODE, () =>
							Effect.fail(
								new CheckoutError.CheckoutRefNotFound({
									ref,
								})
							)
						)
					),
			}).pipe(
				Effect.andThen(Stream.runDrain),
				Effect.scoped,
				Effect.provideService(CommandExecutor.CommandExecutor, executor)
			)
		}
	})
)

export { Live }
