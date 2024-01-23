import type { XisArgObjBase } from "#core/context.js"

import type { XisIssue } from "#core/error.js"
import { Left, Right } from "purify-ts/Either"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { isNumber, type BaseTypeIssue } from "#core/base-type.js"

export type IntegerIssue = XisIssue<"INTEGER">

export class XisInteger extends XisSync<number, BaseTypeIssue<"number">, IntegerIssue> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"number">, IntegerIssue, number> {
		return isNumber(value, ctx).chain((value) => this.exec(value, ctx))
	}

	exec(value: number, ctx: XisArgObjBase): ExecResultSync<IntegerIssue, number> {
		if (Number.isInteger(value)) {
			return Right(value)
		}

		const err = {
			name: "INTEGER",
			path: ctx.path,
		} satisfies IntegerIssue

		return Left([err])
	}
}

export const integer: XisInteger = new XisInteger()
