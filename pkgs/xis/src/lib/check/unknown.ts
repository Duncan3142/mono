import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisUnknown extends XisSync<unknown> {
	parse(value: unknown): ExecResultSync<never, unknown> {
		return Right(value)
	}
	exec(value: unknown): ExecResultSync<never, unknown> {
		return Right(value)
	}
}

export const unknown: XisUnknown = new XisUnknown()
