import type { XisArgObjBase } from "#core/context.js"
import { type BaseTypeIssue, isBoolean } from "#core/base-type.js"
import { Right } from "purify-ts/Either"
import { XisSync } from "#core/sync.js"

export class XisBoolean extends XisSync<boolean, BaseTypeIssue<"boolean">> {
	parse(value: unknown, ctx: XisArgObjBase) {
		return isBoolean(value, ctx)
	}

	exec(value: boolean) {
		return Right(value)
	}
}

export const boolean: XisBoolean = new XisBoolean()
