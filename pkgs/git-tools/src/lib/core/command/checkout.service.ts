import type { Duration } from "effect"
import { Effect } from "effect"
import { Reference } from "#domain"
import { Tag as TagFactory } from "#const"
import { RepositoryContext } from "#context"
import { Checkout, CheckoutMode } from "#executor"
import { CheckoutError, GitCommandError } from "#domain"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode?: CheckoutMode.Mode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `checkout`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all([Checkout.Tag, RepositoryContext.Tag], {
			concurrency: "unbounded",
		})

		return ({
			ref,
			mode = CheckoutMode.Standard(),
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<
			void,
			CheckoutError.RefNotFound | GitCommandError.Failed | GitCommandError.Timeout
		> => executor({ ref, directory, mode, timeout })
	}),
}) {}

export { Service }
export type { Arguments }
