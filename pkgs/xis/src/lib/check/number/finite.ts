import type { XisArgObjBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { Left, Right } from "purify-ts/Either"
import { isNumber, type BaseTypeIssue } from "#core/base-type.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"

export type FiniteIssue = XisIssue<"FINITE">

export class XisFinite extends XisSync<number, BaseTypeIssue<"number">, FiniteIssue> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"number">, FiniteIssue, number> {
		return isNumber(value, ctx).chain((value) => this.exec(value, ctx))
	}

	exec(value: number, ctx: XisArgObjBase): ExecResultSync<FiniteIssue, number> {
		if (Number.isFinite(value)) {
			return Right(value)
		}

		const err = {
			name: "FINITE",
			path: ctx.path,
		} satisfies FiniteIssue

		return Left([err])
	}
}

export const finite: XisFinite = new XisFinite()
