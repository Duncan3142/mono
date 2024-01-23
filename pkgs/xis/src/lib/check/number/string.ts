import { isNumber, type BaseTypeIssue } from "#core/base-type.js"
import type { XisArgObjBase } from "#core/context.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export interface ToStringOptions {
	radix: number
}

export class XisToString<Opts extends ToStringOptions> extends XisSync<
	number,
	BaseTypeIssue<"number">,
	never,
	string
> {
	#opts: Opts

	constructor(opts: Opts) {
		super()
		this.#opts = opts
	}

	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"number">, never, string> {
		return isNumber(value, ctx).chain((value) => this.exec(value))
	}

	exec(value: number): ExecResultSync<never, string> {
		const { radix } = this.#opts

		return Right(value.toString(radix))
	}
}

export const toString = <Opts extends ToStringOptions>(opts: Opts): XisToString<Opts> =>
	new XisToString(opts)
