import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisUnknown extends XisSync<unknown> {
	override get effect(): Effect {
		return Effect.Validate
	}
	exec(args: XisExecArgs<unknown, null>): ExecResultSync<never, unknown> {
		return Right(args.value)
	}
}

export const unknown: XisUnknown = new XisUnknown()
