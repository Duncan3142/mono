import type { XisCtxBase } from "#core/context.js"
import { type ExecResultSync, type ParseResultSync, XisSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Right } from "purify-ts/Either"

import { coerceErr, type CoerceIssue } from "./core.js"

export class XisCoerceNumber extends XisSync<unknown, never, CoerceIssue<"number">, number> {
	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<never, CoerceIssue<"number">, number> {
		return this.exec(value, ctx)
	}

	exec(value: unknown, ctx: XisCtxBase): ExecResultSync<CoerceIssue<"number">, number> {
		const valueType = trueTypeOf(value)
		if (valueType === "symbol") {
			return coerceErr("number", value, valueType, ctx)
		}
		const res = Number(value)
		if (Number.isNaN(res)) {
			return coerceErr("number", value, valueType, ctx)
		}
		return Right(res)
	}
}

export const number: XisCoerceNumber = new XisCoerceNumber()
