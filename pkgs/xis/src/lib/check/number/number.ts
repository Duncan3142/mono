import type { XisCtxBase } from "#core/context.js"
import { isNumber as isBaseNumber, type BaseTypeIssue } from "#core/base-type.js"
import { Right } from "purify-ts/Either"
import { XisSync } from "#core/sync.js"

export class XisNumber extends XisSync<number, BaseTypeIssue<"number">> {
	parse(value: unknown, ctx: XisCtxBase) {
		return isBaseNumber(value, ctx)
	}

	exec(value: number) {
		return Right(value)
	}
}

export const number: XisNumber = new XisNumber()
