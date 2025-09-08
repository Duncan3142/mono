import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/lib/core/const"
import type { GitCommandError, RemoteMode } from "#duncan3142/git-tools/lib/core/domain"

interface Arguments {
	readonly mode: RemoteMode.RemoteMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RemoteExecutor extends Context.Tag(TagFactory.make(`executor`, `remote`))<
	RemoteExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { RemoteExecutor }
export type { Arguments }
