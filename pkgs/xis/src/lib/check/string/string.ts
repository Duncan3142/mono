import { isString, type BaseTypeIssue } from "#core/base-type.js"
import type { XisArgObjBase } from "#core/context.js"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export class XisString extends XisSync<string, BaseTypeIssue<"string">> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"string">, never, string> {
		return isString(value, ctx)
	}
	exec(value: string): ExecResultSync<never, string> {
		return Right(value)
	}
}

export const string: XisString = new XisString()
