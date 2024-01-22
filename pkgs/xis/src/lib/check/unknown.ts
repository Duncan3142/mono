import type { XisArgs } from "#core/context.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisUnknown extends XisSync<unknown> {
	exec(args: XisArgs<unknown, null, null>): ExecResultSync<never, unknown> {
		return Right(args.value)
	}
}

export const unknown: XisUnknown = new XisUnknown()
