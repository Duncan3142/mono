import type { Duration, Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as Reference from "#domain/reference"
import * as MergeBaseError from "#domain/merge-base.error"
import * as GitCommandError from "#domain/git-command.error"

interface Arguments {
	readonly headRef: Reference.Reference
	readonly baseRef: Reference.Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Fetch command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `merge-base`))<
	Tag,
	(
		args: Arguments
	) => Effect.Effect<
		Reference.SHA,
		MergeBaseError.NotFound | GitCommandError.Failed | GitCommandError.Timeout
	>
>() {}

export { Tag }
export type { Arguments }
