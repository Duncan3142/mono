import type { Duration } from "effect"
import { Effect } from "effect"
import PrintRefsExecutor from "#executor/print-refs.service"
import { BRANCH, type REF_TYPE } from "#domain/reference"
import { tag } from "#const"
import Repository from "#context/repository.service"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

interface Arguments {
	readonly type?: REF_TYPE
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class PrintRefsCommand extends Effect.Service<PrintRefsCommand>()(
	tag(`command`, `print-refs`),
	{
		effect: Effect.gen(function* () {
			const [executor, { directory }] = yield* Effect.all([PrintRefsExecutor, Repository], {
				concurrency: "unbounded",
			})

			return ({ type = BRANCH, timeout = "2 seconds" }: Arguments = {}): Effect.Effect<
				void,
				GitCommandFailedError | GitCommandTimeoutError
			> => executor({ type, directory, timeout })
		}),
	}
) {}

export default PrintRefsCommand
export type { Arguments }
