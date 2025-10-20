import { type Array, type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import type {
	FetchError,
	Reference,
	Remote,
	FetchMode,
} from "#duncan3142/git-tools/core/domain"
import { TagFactory } from "#duncan3142/git-tools/internal"

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
		FetchError.FetchRefsNotFound | CommandError.CommandFailed | CommandError.CommandTimeout
	>
>() {}

export { FetchExecutor }
export type { Arguments }
