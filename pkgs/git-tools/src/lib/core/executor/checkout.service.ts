import type { Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { CheckoutRefNotFoundError } from "#domain/checkout.error"

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly createIfNotExists: boolean
}

/**
 * Checkout command service
 */
class CheckoutExecutor extends Context.Tag(tag(`executor`, `checkout`))<
	CheckoutExecutor,
	(args: Arguments) => Effect.Effect<void, CheckoutRefNotFoundError>
>() {}

export default CheckoutExecutor
export type { Arguments }
