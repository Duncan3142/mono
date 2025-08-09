import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { CheckoutRefNotFoundError } from "#domain/checkout.error"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

type CheckoutMode = Data.TaggedEnum<{
	Create: object
	Standard: object
}>

const { Create, Standard, $is, $match } = Data.taggedEnum<CheckoutMode>()

interface Arguments {
	readonly ref: Reference
	readonly directory: string
	readonly mode: CheckoutMode
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
export { Create, Standard, $is, $match }
export type { Arguments }
