import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"
import type { ConfigInput } from "#domain/config"

interface Arguments {
	readonly global: boolean
	readonly input: ConfigInput
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(tag(`executor`, `config`))<
	ConfigExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default ConfigExecutor
export type { Arguments }
