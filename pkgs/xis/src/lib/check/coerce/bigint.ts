import type { XisCtxBase } from "#core/context.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Either, Right } from "purify-ts/Either"
import { coerceErr, type CoerceIssue } from "./core.js"

export type BigIntInput = bigint | number | string | boolean

export class XisCoerceBigInt extends XisSync<
	BigIntInput,
	CoerceIssue<"bigint">,
	CoerceIssue<"bigint">,
	bigint
> {
	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<CoerceIssue<"bigint">, CoerceIssue<"bigint">, bigint> {
		const valueType = trueTypeOf(value)
		if (valueType === "bigint") {
			return Right(value as bigint)
		}
		if (valueType === "number" || valueType === "string" || valueType === "boolean") {
			return this.exec(value as BigIntInput, ctx)
		}

		return coerceErr("bigint", value, valueType, ctx)
	}

	exec(value: BigIntInput, ctx: XisCtxBase): ExecResultSync<CoerceIssue<"bigint">, bigint> {
		return Either.encase(() => BigInt(value)).chainLeft((_) => {
			const valueType = trueTypeOf(value)
			return coerceErr("bigint", value, valueType, ctx)
		})
	}
}

export const bigint: XisCoerceBigInt = new XisCoerceBigInt()
