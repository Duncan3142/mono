import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { TagFactory } from "#const"
import { GitCommandError, ConfigMode, ConfigScope } from "#domain"

interface Arguments {
	readonly scope: ConfigScope.Scope
	readonly input: ConfigMode.Mode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `config`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
