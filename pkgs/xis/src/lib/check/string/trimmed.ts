import { isString, type BaseTypeIssue } from "#core/base-type.js"
import type { XisArgObjBase } from "#core/context.js"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisTrimmed extends XisSync<string, BaseTypeIssue<"string">> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"string">, never, string> {
		return isString(value, ctx).chain((v) => this.exec(v))
	}
	exec(value: string): ExecResultSync<never, string> {
		return Right(value.trim())
	}
}

export const trimmed: XisTrimmed = new XisTrimmed()
