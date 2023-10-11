import { isNumber, type BaseTypeIssue } from "#core/base-type.js"
import type { XisCtxBase } from "#core/context.js"

import type { XisIssue } from "#core/error.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export type NaNIssue = XisIssue<"NAN">

export class XisNan extends XisSync<number, BaseTypeIssue<"number">, NaNIssue> {
	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<BaseTypeIssue<"number">, NaNIssue, number> {
		return isNumber(value, ctx).chain((value) => this.exec(value, ctx))
	}

	exec(value: number, ctx: XisCtxBase): ExecResultSync<NaNIssue, number> {
		if (Number.isNaN(value)) {
			return Right(value)
		}

		const err = {
			name: "NAN",
			path: ctx.path,
		} satisfies NaNIssue
		return Left([err])
	}
}

export const isNaN: XisNan = new XisNan()
