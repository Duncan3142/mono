import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Layer, pipe, Effect, Match, Console } from "effect"
import commandFactory, { type ErrorCode } from "./command.ts"
import CheckoutCommandExecutor, { type Arguments } from "#command/checkout-executor.service"
import RepositoryConfig from "#config/repository-config.service"
import { CheckoutRefNotFoundError } from "#domain/checkout.error"

const CHECKOUT_REF_NOT_FOUND_CODE = 1

const CheckoutCommandExecutorLive: Layer.Layer<
	CheckoutCommandExecutor,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	CheckoutCommandExecutor,
	Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[CommandExecutor.CommandExecutor, RepositoryConfig],
			{ concurrency: "unbounded" }
		)

		return ({ ref: { name: ref } }: Arguments): Effect.Effect<void, CheckoutRefNotFoundError> =>
			Effect.gen(function* () {
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "checkout",
						subArgs: ["--progress", ref],
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

export default CheckoutCommandExecutorLive
