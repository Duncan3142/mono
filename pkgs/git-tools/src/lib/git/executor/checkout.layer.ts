import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match, Console } from "effect"
import commandFactory, { type ErrorCode } from "./executor.ts"
import CheckoutExecutor, { type Arguments, $match } from "#executor/checkout.service"
import { CheckoutRefNotFoundError } from "#domain/checkout.error"
import * as GitCommandError from "#domain/git-command.error"

const CHECKOUT_REF_NOT_FOUND_CODE = 1

const CheckoutExecutorLive: Layer.Layer<
	CheckoutExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	CheckoutExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			ref: { name: ref },
			directory,
			mode,
			timeout,
		}: Arguments): Effect.Effect<
			void,
			CheckoutRefNotFoundError | GitCommandFailedError | GitCommandTimeoutError
		> =>
			Effect.gen(function* () {
				const createBranchArg = $match(mode, {
					Create: () => ["-b"],
					Standard: () => [],
				})

				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "checkout",
						subArgs: ["--progress", ...createBranchArg, ref],
						timeout,
						errorMatcher: (errorCode: ErrorCode) =>
							pipe(
								Match.value(errorCode),
								Match.when(CHECKOUT_REF_NOT_FOUND_CODE, () =>
									Effect.fail(
										new CheckoutRefNotFoundError({
											ref,
										})
									)
								)
							),
					}),
					Effect.flatMap(Console.log),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default CheckoutExecutorLive
