import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { Reference } from "#domain/reference"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

type GitSHA = string

/**
 * Fetch command service
 */
class MergeBaseExecutor extends Context.Tag(tag(`executor`, `merge-base`))<
	MergeBaseExecutor,
	(args: Arguments) => Effect.Effect<GitSHA, MergeBaseNotFoundError>
>() {}

export default MergeBaseExecutor
export type { Arguments }
