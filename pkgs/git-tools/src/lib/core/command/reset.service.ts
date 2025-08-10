import type { Duration } from "effect"
import { Effect } from "effect"
import { Reference, GitCommandError } from "#domain"
import { TagFactory } from "#const"
import { RepositoryContext } from "#context"
import { ResetMode } from "#domain"
import { ResetExecutor } from "#executor"

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode?: ResetMode.Mode
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`command`, `reset`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[ResetExecutor.Tag, RepositoryContext.Tag],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			ref,
			mode = ResetMode.Hard(),
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout> =>
			executor({ ref, mode, directory, timeout })
	}),
}) {}

const Default = Service.Default

export { Service, Default }
export type { Arguments }
