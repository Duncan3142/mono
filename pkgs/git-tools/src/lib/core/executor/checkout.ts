import type { Duration, Effect } from "effect"
import { Context } from "effect"
import { Reference, GitCommandError, CheckoutError } from "#domain"
import * as Const from "#const"
import * as BranchMode from "./checkout.mode.ts"

interface Arguments {
	readonly ref: Reference.Reference
	readonly directory: string
	readonly mode: BranchMode.Mode
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

export { Tag }
export type { Arguments }
