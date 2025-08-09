import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Reference from "#domain/reference"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"

type ResetMode = Data.TaggedEnum<{
	Hard: object
	Mixed: object
	Soft: object
}>

const ResetMode = Data.taggedEnum<ResetMode>()

interface Arguments {
	readonly ref: Reference.Reference
	readonly mode: ResetMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class ResetExecutor extends Context.Tag(Const.tag(`executor`, `reset`))<
	ResetExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { ResetExecutor, ResetMode }
export type { Arguments }
