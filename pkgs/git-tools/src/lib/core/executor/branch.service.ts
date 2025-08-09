import type { Duration, Effect } from "effect"
import { Context, Data } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

type BranchMode = Data.TaggedEnum<{
	Print: object
}>

const { Print, $is, $match } = Data.taggedEnum<BranchMode>()

interface Arguments {
	readonly mode: BranchMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class BranchExecutor extends Context.Tag(tag(`executor`, `branch`))<
	BranchExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default BranchExecutor
export { Print, $is, $match }
export type { Arguments, BranchMode }
