import { type Duration, Effect, pipe } from "effect"
import { type CommandError, LogSpan } from "@duncan3142/effect"
import {
	type Reference,
	type CheckoutError,
	CheckoutMode,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { CheckoutExecutor } from "#duncan3142/git-tools/core/executor"
import { ExecutorTimer } from "#duncan3142/git-tools/core/telemetry"

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
				| CommandError.CommandFailed
				| CommandError.CommandTimeout
			> = ({ ref, mode = CheckoutMode.Standard(), timeout = "2 seconds" }) =>
				executor({ ref, directory, mode, timeout }).pipe(
					ExecutorTimer.duration({ tags: { "executor.name": "git.checkout" } })
				)

			return pipe(
				handler,
				LogSpan.wrap({ log: { message: "Git checkout" }, span: { name: "git.checkout" } })
			)
		}),
	}
) {}

const { Default } = CheckoutCommand

export { CheckoutCommand, Default }
export type { Arguments }
