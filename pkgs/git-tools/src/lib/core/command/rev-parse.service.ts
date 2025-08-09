import type { Duration } from "effect"
import { Effect } from "effect"
import type { Reference } from "#domain/reference"
import { Tag } from "#const"
import Tag from "#context/repository.service"
import RevParseExecutor from "#executor/rev-parse.service"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly ref: Reference
	readonly timeout?: Duration.DurationInput
}

/**
 * Print refs service
 */
class RevParseCommand extends Effect.Service<RevParseCommand>()(tag(`command`, `rev-parse`), {
	effect: Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all([RevParseExecutor, Tag], {
			concurrency: "unbounded",
		})

		return ({
			ref,
			timeout = "2 seconds",
		}: Arguments): Effect.Effect<string, GitCommandFailedError | GitCommandTimeoutError> =>
			executor({ ref, directory, timeout })
	}),
}) {}

export default RevParseCommand
export type { Arguments }
