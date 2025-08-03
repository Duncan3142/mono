import type { Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { CheckoutRefNotFoundError } from "#domain/checkout.error"
import type { Repository } from "#domain/repository"

interface Arguments {
	readonly ref: Reference
	readonly repository: Repository
}

/**
 * Checkout command service
 */
class CheckoutCommandExecutor extends Context.Tag(tag(`command`, `checkout-executor`))<
	CheckoutCommandExecutor,
	(args: Arguments) => Effect.Effect<void, CheckoutRefNotFoundError>
>() {}

export default CheckoutCommandExecutor
export type { Arguments }
