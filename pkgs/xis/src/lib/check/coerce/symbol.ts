import type { XisArgObjBase } from "#core/context.js"

import { type ExecResultSync, type ParseResultSync, XisSync } from "#core/sync.js"

import { trueTypeOf } from "#util/base-type.js"
import { Right } from "purify-ts/Either"

import { coerceErr, type CoerceIssue } from "./core.js"

export type SymbolInput = number | string | undefined

export class XisCoerceSymbol extends XisSync<
	SymbolInput,
	CoerceIssue<"symbol">,
	never,
	symbol
> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<CoerceIssue<"symbol">, never, symbol> {
		const valueType = trueTypeOf(value)
		if (
			typeof value === "number" ||
			typeof value === "string" ||
			typeof value === "undefined"
		) {
			return this.exec(value)
		}
		return coerceErr("symbol", value, valueType, ctx)
	}

	exec(value: SymbolInput): ExecResultSync<never, symbol> {
		return Right(Symbol(value))
	}
}

export const symbol: XisCoerceSymbol = new XisCoerceSymbol()
