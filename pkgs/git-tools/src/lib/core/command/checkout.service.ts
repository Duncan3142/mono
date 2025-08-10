import type { Duration } from "effect"
import { Effect } from "effect"
import { Reference } from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { CheckoutExecutor } from "#duncan3142/git-tools/executor"
import { CheckoutError, GitCommandError, CheckoutMode } from "#duncan3142/git-tools/domain"

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
		const [executor, { directory }] = yield* Effect.all(
			[CheckoutExecutor.Tag, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

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

const Default = Service.Default

export { Service, Default }
export type { Arguments }
