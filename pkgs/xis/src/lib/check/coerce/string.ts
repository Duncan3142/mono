import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisCoerceString extends XisSync<unknown, never, string> {
	override get effect(): Effect {
		return Effect.Transform
	}
	exec(args: XisExecArgs): ExecResultSync<never, string> {
		return Right(String(args.value))
	}
}

export const string: XisCoerceString = new XisCoerceString()
