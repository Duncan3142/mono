import type { Array, Duration, Effect } from "effect"
import { Context } from "effect"
import * as FetchError from "#domain/fetch.error"
import * as Const from "#const"
import * as Reference from "#domain/reference"
import * as Remote from "#domain/remote"
import * as GitCommandError from "#domain/git-command.error"
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
class Tag extends Context.Tag(Const.tag(`executor`, `fetch`))<
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
