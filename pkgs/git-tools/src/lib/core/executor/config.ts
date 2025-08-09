import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Tag as TagFactory } from "#const"
import { GitCommandError } from "#domain"
import * as Mode from "./config.mode.ts"
import * as Scope from "./config.scope.ts"

interface Arguments {
	readonly scope: Scope.Scope
	readonly input: Mode.Mode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `config`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode, Scope }
export type { Arguments }
