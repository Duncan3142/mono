import type { XisCtxBase } from "#core/context.js"
import { type ExecResultSync, type ParseResultSync, XisSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Right } from "purify-ts/Either"
import { coerceErr, type CoerceIssue } from "./core.js"

export type DateInput = Date | number | string

export class XisCoerceDate extends XisSync<
	DateInput,
	CoerceIssue<"date">,
	CoerceIssue<"date">,
	Date
> {
	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<CoerceIssue<"date">, CoerceIssue<"date">, Date> {
		const valueType = trueTypeOf(value)
		if (valueType === "number" || valueType === "string" || valueType === "date") {
			return this.exec(value as DateInput, ctx)
		}
		return coerceErr("date", value, valueType, ctx)
	}

	exec(value: DateInput, ctx: XisCtxBase): ExecResultSync<CoerceIssue<"date">, Date> {
		const res = new Date(value)
		if (Number.isNaN(res.valueOf())) {
			const valueType = trueTypeOf(value)
			return coerceErr("date", value, valueType, ctx)
		}
		return Right(res)
	}
}

export const date: XisCoerceDate = new XisCoerceDate()
