import { type Duration, type Effect, Context } from "effect"
import type {
	Reference,
	GitCommandError,
	CheckoutError,
	CheckoutMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"

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
		| CheckoutError.CheckoutRefNotFound
		| GitCommandError.GitCommandFailed
		| GitCommandError.GitCommandTimeout
	>
>() {}

export { CheckoutExecutor }
export type { Arguments }
