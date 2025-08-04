import type { Duration, Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { CheckoutRefNotFoundError } from "#domain/checkout.error"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly createIfNotExists: boolean
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CheckoutExecutor extends Context.Tag(tag(`executor`, `checkout`))<
	CheckoutExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		CheckoutRefNotFoundError | GitCommandFailedError | GitCommandTimeoutError
	>
>() {}

export default CheckoutExecutor
export type { Arguments }
