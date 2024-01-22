import type { XisArg } from "#core/context.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisUnknown extends XisSync<unknown> {
	exec(args: XisArg<unknown, null, null>): ExecResultSync<never, unknown> {
		return Right(args.value)
	}
}

export const unknown: XisUnknown = new XisUnknown()
