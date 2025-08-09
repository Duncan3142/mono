import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Tag as TagFactory } from "#const"
import { GitCommandError } from "#domain"
import * as Mode from "./remote.mode.ts"

interface Arguments {
	readonly mode: Mode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(TagFactory.make(`executor`, `remote`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag, Mode }
export type { Arguments }
