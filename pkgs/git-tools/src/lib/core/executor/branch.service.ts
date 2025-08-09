import type { Duration, Effect } from "effect"
import { Context, Data } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

type BranchMode = Data.TaggedEnum<{
	Print: object
}>

const BranchMode = Data.taggedEnum<BranchMode>()

interface Arguments {
	readonly mode: BranchMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class BranchExecutor extends Context.Tag(Const.tag(`executor`, `branch`))<
	BranchExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { BranchExecutor, BranchMode }
export type { Arguments }
