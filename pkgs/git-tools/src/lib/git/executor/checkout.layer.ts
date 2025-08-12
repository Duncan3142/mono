import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match } from "effect"
import * as Base from "./base.ts"
import { CheckoutExecutor } from "#duncan3142/git-tools/executor"
import { type GitCommandError, CheckoutError, CheckoutMode } from "#duncan3142/git-tools/domain"

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
				subCommand: "checkout",
				subArgs: ["--progress", ...createBranchArg, ref],
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
			}).pipe(Effect.scoped, Effect.provideService(CommandExecutor.CommandExecutor, executor))
		}
	})
)

export { Live }
