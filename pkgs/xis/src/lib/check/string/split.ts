import { isString, type BaseTypeIssue } from "#core/base-type.js"
import type { XisCtxBase } from "#core/context.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export type Separator = string | RegExp

export class XisSplit extends XisSync<string, BaseTypeIssue<"string">, never, Array<string>> {
	#separator: Separator

	constructor(separator: Separator = "") {
		super()
		this.#separator = separator
	}

	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<BaseTypeIssue<"string">, never, Array<string>> {
		return isString(value, ctx).chain((v) => this.exec(v))
	}
	exec(value: string): ExecResultSync<never, Array<string>> {
		return Right(value.split(this.#separator))
	}
}

export const split = (separator: Separator = ""): XisSplit => new XisSplit(separator)
