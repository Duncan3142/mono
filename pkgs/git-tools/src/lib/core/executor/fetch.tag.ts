import { type Array, type Duration, type Effect, Context } from "effect"
import type {
	FetchError,
	Reference,
	Remote,
	GitCommandError,
	FetchMode,
} from "#duncan3142/git-tools/domain"
import { TagFactory } from "#duncan3142/git-tools/const"

interface Arguments {
	readonly mode: FetchMode.Mode
	readonly remote: Remote.Remote
	readonly refs: Array.NonEmptyReadonlyArray<Reference.Reference>
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `fetch`))<
	Tag,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		FetchError.RefsNotFound | GitCommandError.Failed | GitCommandError.Timeout
	>
>() {}

export { Tag }
export type { Arguments }
