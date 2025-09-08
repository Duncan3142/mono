import { type Duration, Effect } from "effect"
import {
	type Reference,
	type CheckoutError,
	type GitCommandError,
	CheckoutMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { CheckoutExecutor } from "#duncan3142/git-tools/lib/core/executor"
import { ExecutorDuration, ExecutorLog } from "#duncan3142/git-tools/lib/core/telemetry"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode?: CheckoutMode.CheckoutMode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class CheckoutCommand extends Effect.Service<CheckoutCommand>()(
	TagFactory.make(`command`, `checkout`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all(
				[CheckoutExecutor.CheckoutExecutor, RepositoryContext.RepositoryContext],
				{
					concurrency: "unbounded",
				}
			)

			const handler: (
				args: Arguments
			) => Effect.Effect<
				void,
				| CheckoutError.CheckoutRefNotFound
				| GitCommandError.GitCommandFailed
				| GitCommandError.GitCommandTimeout
			> = ExecutorLog.wrap(
				"Git checkout",
				({ ref, mode = CheckoutMode.Standard(), timeout = "2 seconds" }) =>
					executor({ ref, directory, mode, timeout }).pipe(
						ExecutorDuration.duration("git-checkout"),
						Effect.withSpan("git-checkout")
					)
			)

			return handler
		}),
	}
) {}

const { Default } = CheckoutCommand

export { CheckoutCommand, Default }
export type { Arguments }
