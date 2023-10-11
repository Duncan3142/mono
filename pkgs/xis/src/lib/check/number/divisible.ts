import type { XisCtxBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { isNumber, type BaseTypeIssue } from "#core/base-type.js"

export interface NumberDivisibleOptions {
	divisor: number
}

export interface NumberDivisibleIssue<Opts extends NumberDivisibleOptions>
	extends XisIssue<"DIVISIBLE"> {
	value: number
	divisor: Opts["divisor"]
	remainder: number
}

export class XisDivisible<const Opts extends NumberDivisibleOptions> extends XisSync<
	number,
	BaseTypeIssue<"number">,
	NumberDivisibleIssue<Opts>
> {
	#opts: Opts

	constructor(opts: Opts) {
		super()
		this.#opts = opts
	}

	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<BaseTypeIssue<"number">, NumberDivisibleIssue<Opts>, number> {
		return isNumber(value, ctx).chain((value) => this.exec(value, ctx))
	}

	exec(value: number, ctx: XisCtxBase): ExecResultSync<NumberDivisibleIssue<Opts>, number> {
		const { divisor } = this.#opts

		const remainder = value % divisor
		if (remainder === 0) {
			return Right(value)
		}
		const err = {
			name: "DIVISIBLE",
			path: ctx.path,
			value,
			divisor,
			remainder,
		} satisfies NumberDivisibleIssue<Opts>

		return Left([err])
	}
}

export const divisible = <const Opts extends NumberDivisibleOptions>(
	options: Opts
): XisDivisible<Opts> => new XisDivisible(options)
