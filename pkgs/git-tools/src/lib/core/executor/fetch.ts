import type { Array, Duration, Effect } from "effect"
import { Context } from "effect"
import { FetchError, Reference, Remote, GitCommandError } from "#domain"
import { Tag as TagFactory } from "#const"
import * as Mode from "./fetch.mode.ts"

interface Arguments {
	readonly mode: Mode.Mode
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

export { Tag, Mode }
export type { Arguments }
