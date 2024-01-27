import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisCoerceBoolean extends XisSync<unknown, never, boolean> {
	override get effect(): Effect {
		return Effect.Transform
	}
	exec(args: XisExecArgs): ExecResultSync<never, boolean> {
		return Right(Boolean(args.value))
	}
}

export const boolean: XisCoerceBoolean = new XisCoerceBoolean()
