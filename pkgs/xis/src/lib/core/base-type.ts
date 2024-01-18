import type { XisIssue } from "#core/error.js"

import type { XisArgBase } from "#core/context.js"
import {
	trueTypeOf,
	type TrueBaseTypeName,
	isBaseType,
	type TrueBaseTypeNameMap,
	type TupleOf,
} from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"
import type { ExecResultSync } from "./sync.js"

export interface BaseTypeIssue<Expected extends TrueBaseTypeName>
	extends XisIssue<"INVALID_TYPE"> {
	expected: Expected
	received: TrueBaseTypeName
}

const typeCheck =
	<N extends TrueBaseTypeName>(
		trueTypeName: N
	): ((
		value: unknown,
		args: XisArgBase
	) => ExecResultSync<BaseTypeIssue<N>, TrueBaseTypeNameMap[N]>) =>
	(
		value: unknown,
		ctx: XisArgBase
	): ExecResultSync<BaseTypeIssue<N>, TrueBaseTypeNameMap[N]> => {
		const receivedType = trueTypeOf(value)
		if (isBaseType(trueTypeName, value)) {
			return Right(value)
		}

		const err = {
			name: "INVALID_TYPE",
			expected: trueTypeName,
			received: receivedType,
			path: ctx.path,
		} satisfies BaseTypeIssue<N>

		return Left([err])
	}

export const isNull = typeCheck("null")
export const isUndefined = typeCheck("undefined")
export const isString = typeCheck("string")
export const isNumber = typeCheck("number")
export const isBoolean = typeCheck("boolean")
export const isBigInt = typeCheck("bigint")
export const isSymbol = typeCheck("symbol")
export const isBaseArray = typeCheck("array")
export const isBaseObject = typeCheck("object")
export const isBaseFunction = typeCheck("function")
export const isDate = typeCheck("date")
export const isBaseMap = typeCheck("map")
export const isBaseSet = typeCheck("set")

export interface TupleLengthIssue extends XisIssue<"TUPLE_LENGTH"> {
	expected: number
	actual: number
}

export const isTupleOf = <Length extends number>(
	value: unknown,
	expected: Length,
	args: XisArgBase
): ExecResultSync<TupleLengthIssue | BaseTypeIssue<"array">, TupleOf<Length>> =>
	isBaseArray(value, args).chain((arr) =>
		arr.length === expected
			? Right(arr as TupleOf<Length>)
			: Left([
					{
						name: "TUPLE_LENGTH",
						path: args.path,
						expected,
						actual: arr.length,
					},
				])
	)
