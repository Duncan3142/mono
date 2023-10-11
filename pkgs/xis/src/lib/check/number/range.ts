import type { XisCtxBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { isNumber, type BaseTypeIssue } from "#core/base-type.js"

export type NumberRangeOpts = RangeOpts<number>

export interface NumberRangeIssue extends XisIssue<"NUMBER_RANGE"> {
	received: number
	opts: NumberRangeOpts
}

export class XisRange<Opts extends NumberRangeOpts> extends XisSync<
	number,
	BaseTypeIssue<"number">,
	NumberRangeIssue
> {
	#opts: Opts

	constructor(opts: Opts) {
		super()
		this.#opts = opts
	}

	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<BaseTypeIssue<"number">, NumberRangeIssue, number> {
		return isNumber(value, ctx).chain((value) => this.exec(value, ctx))
	}

	exec(value: number, ctx: XisCtxBase): ExecResultSync<NumberRangeIssue, number> {
		const opts = this.#opts

		if (inRange(value, opts)) {
			return Right(value)
		}

		const err = {
			name: "NUMBER_RANGE",
			path: ctx.path,
			received: value,
			opts,
		} satisfies NumberRangeIssue
		return Left([err])
	}
}

export const range = <Opts extends NumberRangeOpts>(options: Opts): XisRange<Opts> =>
	new XisRange(options)
