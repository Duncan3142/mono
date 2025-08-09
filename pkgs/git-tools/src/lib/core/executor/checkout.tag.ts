import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Reference from "#domain/reference"
import * as Const from "#const"
import * as CheckoutError from "#domain/checkout.error"
import * as GitCommandError from "#domain/git-command.error"

type Mode = Data.TaggedEnum<{
	Create: object
	Standard: object
}>

const Mode = Data.taggedEnum<Mode>()

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly mode: Mode
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class Tag extends Context.Tag(Const.tag(`executor`, `checkout`))<
	Tag,
	(
		args: Arguments
	) => Effect.Effect<
		void,
		CheckoutError.RefNotFound | GitCommandError.Failed | GitCommandError.Timeout
	>
>() {}

export { Tag, Mode }
export type { Arguments }
