import type { Duration, Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import { GitCommandError } from "#domain"
import * as BranchMode from "./branch.mode.ts"

interface Arguments {
	readonly mode: BranchMode.Mode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `branch`))<
	Tag,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { Tag }
export type { Arguments }
