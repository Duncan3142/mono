import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"
import type { RemoteInput } from "#domain/remote"

interface Arguments {
	readonly input: RemoteInput
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(tag(`executor`, `remote`))<
	ConfigExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default ConfigExecutor
export type { Arguments }
