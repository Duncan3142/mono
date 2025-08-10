import { type Duration, type Effect, Context } from "effect"
import { TagFactory } from "#duncan3142/git-tools/const"
import type { GitCommandError, ConfigMode, ConfigScope } from "#duncan3142/git-tools/domain"

interface Arguments {
	readonly scope: ConfigScope.ConfigScope
	readonly input: ConfigMode.ConfigMode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(TagFactory.make(`executor`, `config`))<
	ConfigExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout>
>() {}

export { ConfigExecutor }
export type { Arguments }
