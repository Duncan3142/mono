import type { Duration } from "effect"
import { Effect } from "effect"
import type { Reference } from "#domain/reference"
import { Tag } from "#const"
import Tag from "#context/repository.service"
import CheckoutExecutor from "#executor/checkout.service"
import type { CheckoutRefNotFoundError } from "#domain/checkout.error"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly ref: Reference
	readonly createIfNotExists?: boolean
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class CheckoutCommand extends Effect.Service<CheckoutCommand>()(tag(`command`, `checkout`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all([CheckoutExecutor, Tag], {
			concurrency: "unbounded",
		})

		return ({
			ref,
			createIfNotExists = false,
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<
			void,
			CheckoutRefNotFoundError | GitCommandFailedError | GitCommandTimeoutError
		> => executor({ ref, directory, createIfNotExists, timeout })
	}),
}) {}

export default CheckoutCommand
export type { Arguments }
