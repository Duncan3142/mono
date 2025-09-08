import { type Array, type Duration, type Effect, Context } from "effect"
import type {
	FetchError,
	Reference,
	Remote,
	GitCommandError,
	FetchMode,
} from "#duncan3142/git-tools/lib/core/domain"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"

interface Arguments {
	readonly mode: FetchMode.FetchMode
	readonly remote: Remote.Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference.Reference>
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class FetchExecutor extends Context.Tag(TagFactory.make(`executor`, `fetch`))<
	FetchExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		| FetchError.FetchRefsNotFound
		| GitCommandError.GitCommandFailed
		| GitCommandError.GitCommandTimeout
	>
>() {}

export { FetchExecutor }
export type { Arguments }
