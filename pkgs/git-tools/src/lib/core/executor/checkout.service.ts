import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Reference from "#domain/reference"
import * as Const from "#const"
import * as CheckoutError from "#domain/checkout.error"
import * as GitCommandError from "#domain/git-command.error"

type CheckoutMode = Data.TaggedEnum<{
	Create: object
	Standard: object
}>

const CheckoutMode = Data.taggedEnum<CheckoutMode>()

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly mode: CheckoutMode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class CheckoutExecutor extends Context.Tag(Const.tag(`executor`, `checkout`))<
	CheckoutExecutor,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		CheckoutError.RefNotFound | GitCommandError.Failed | GitCommandError.Timeout
	>
>() {}

export { CheckoutExecutor, CheckoutMode }
export type { Arguments }
