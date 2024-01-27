import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisTrimmed extends XisSync<string> {
	override get effect(): Effect {
		return Effect.Transform
	}
	exec(args: XisExecArgs<string>): ExecResultSync<never, string> {
		const { value } = args
		return Right(value.trim())
	}
}

export const trimmed: XisTrimmed = new XisTrimmed()
