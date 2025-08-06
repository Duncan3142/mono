import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import type { Reference } from "#domain/reference"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"

type ResetMode = Data.TaggedEnum<{
	Hard: object
	Mixed: object
	Soft: object
}>

const { Hard, Mixed, Soft, $is, $match } = Data.taggedEnum<ResetMode>()

interface Arguments {
	readonly ref: Reference
	readonly mode: ResetMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ResetExecutor extends Context.Tag(tag(`executor`, `reset`))<
	ResetExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default ResetExecutor
export { Hard, Mixed, Soft, $is, $match }
export type { Arguments, ResetMode }
