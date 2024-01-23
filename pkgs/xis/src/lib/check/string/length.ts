import type { XisArgObjBase } from "#core/context.js"

import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { isString, type BaseTypeIssue } from "#core/base-type.js"

export type StringLengthOpts = RangeOpts<number>

export class XisToLength extends XisSync<string, BaseTypeIssue<"string">, never, number> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"string">, never, number> {
		return isString(value, ctx).chain((v) => this.exec(v))
	}
	exec(value: string): ExecResultSync<never, number> {
		return Right(value.length)
	}
}

export const toLength: XisToLength = new XisToLength()

export interface StringLengthIssue extends XisIssue<"STRING_LENGTH"> {
	length: number
	opts: StringLengthOpts
}

export class XisIsLength<Opts extends StringLengthOpts> extends XisSync<
	string,
	BaseTypeIssue<"string">,
	StringLengthIssue
> {
	#opts: Opts

	constructor(opts: Opts) {
		super()
		this.#opts = opts
	}

	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"string">, StringLengthIssue, string> {
		return isString(value, ctx).chain((v) => this.exec(v, ctx))
	}

	exec(value: string, ctx: XisArgObjBase): ExecResultSync<StringLengthIssue, string> {
		const opts = this.#opts

		if (inRange(value.length, opts)) {
			return Right(value)
		}

		const err = {
			name: "STRING_LENGTH",
			path: ctx.path,
			length: value.length,
			opts,
		} satisfies StringLengthIssue

		return Left([err])
	}
}

export const isLength = <Opts extends StringLengthOpts>(options: Opts): XisIsLength<Opts> =>
	new XisIsLength(options)
