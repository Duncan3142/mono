import { type Duration, type Effect, Context } from "effect"
import type { CommandError } from "@duncan3142/effect"
import { TagFactory } from "#duncan3142/git-tools/internal"
import type { ConfigMode, ConfigScope } from "#duncan3142/git-tools/core/domain"

interface Arguments {
	readonly directory: string
	readonly scope: ConfigScope.ConfigScope
	readonly mode: ConfigMode.ConfigMode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ConfigExecutor extends Context.Tag(TagFactory.make(`executor`, `config`))<
	ConfigExecutor,
	(
		args: Arguments
	) => Effect.Effect<void, CommandError.CommandFailed | CommandError.CommandTimeout>
>() {}

export { ConfigExecutor }
export type { Arguments }
