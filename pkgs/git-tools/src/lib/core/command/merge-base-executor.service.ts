import type { Effect } from "effect"
import { Context } from "effect"
import { SERVICE_PREFIX } from "#const"
import type { Reference } from "#domain/reference"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
}

type GitSHA = string

/**
 * Fetch command service
 */
class MergeBaseCommandExecutor extends Context.Tag(
	`${SERVICE_PREFIX}/command/merge-base-executor`
)<
	MergeBaseCommandExecutor,
	({ headRef, baseRef }: Arguments) => Effect.Effect<GitSHA, MergeBaseNotFoundError>
>() {}

export default MergeBaseCommandExecutor
export type { Arguments }
