import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { GitCommandError, Reference, Remote } from "#duncan3142/git-tools/lib/core/domain"

interface Arguments {
	readonly directory: string
	readonly forceWithLease: boolean
	readonly remote: Remote.Remote
	readonly ref: Reference.Reference
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class PushExecutor extends Context.Tag(TagFactory.make(`executor`, `push`))<
	PushExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { PushExecutor }
export type { Arguments }
