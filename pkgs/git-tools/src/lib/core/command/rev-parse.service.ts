import type { Duration } from "effect"
import { Effect } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import Repository from "#context/repository.service"
import RevParseExecutor from "#executor/rev-parse.service"

interface Arguments {
	readonly ref: Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class RevParseCommand extends Effect.Service<RevParseCommand>()(tag(`command`, `rev-parse`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all([RevParseExecutor, Repository], {
			concurrency: "unbounded",
		})

		return ({ ref, timeout = "2 seconds" }: Arguments): Effect.Effect<void> =>
			executor({ ref, directory, timeout })
	}),
}) {}

export default RevParseCommand
export type { Arguments }
