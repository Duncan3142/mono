import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import type { Reference, CheckoutError, CheckoutMode } from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly mode: CheckoutMode.CheckoutMode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CheckoutExecutor extends Context.Tag(TagFactory.make(`executor`, `checkout`))<
	CheckoutExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		CheckoutError.CheckoutRefNotFound | CommandError.CommandFailed | CommandError.CommandTimeout
	>
>() {}

export { CheckoutExecutor }
export type { Arguments }
