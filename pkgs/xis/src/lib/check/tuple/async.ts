import {
	type TupleArgs,
	type TupleExecIssues,
	type TupleGuardIssues,
	type TupleIn,
	type TupleOut,
	reduce,
} from "./core.js"
import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"

import type { XisIssueBase } from "#core/error.js"
import { isTupleOf } from "#core/base-type.js"
import {
	invoke,
	type ExInvoke,
	type InvokeMode,
	type XisBase,
	type ExIn,
	type ExArgs,
} from "#core/kernel.js"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import { EitherAsync } from "purify-ts/EitherAsync"

export class XisTupleAsync<Schema extends [...Array<XisBase>]> extends XisAsync<
	TupleIn<Schema>,
	TupleGuardIssues<Schema>,
	TupleExecIssues<Schema>,
	TupleOut<Schema>,
	TupleArgs<Schema>
> {
	readonly #checks: [...Schema]

	constructor(chks: [...Schema]) {
		super()
		this.#checks = chks
	}

	parse(
		value: unknown,
		ctx: XisCtx<TupleArgs<Schema>>
	): ParseResultAsync<TupleGuardIssues<Schema>, TupleExecIssues<Schema>, TupleOut<Schema>> {
		return EitherAsync.liftEither(isTupleOf(value, this.#checks.length, ctx))
			.chain((arr) => this.#invoke("parse", arr, ctx))
			.run()
	}

	exec(
		value: TupleIn<Schema>,
		ctx: XisCtx<TupleArgs<Schema>>
	): ExecResultAsync<TupleExecIssues<Schema>, TupleOut<Schema>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: Array<unknown>,
		ctx: XisCtx<TupleArgs<Schema>>
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>

		return Promise.all(
			value.map<ExecResultAsync<XisIssueBase, unknown>>((elem, index) => {
				const check = this.#checks[index]!
				return Promise.resolve(
					invoke(
						mode,
						check,
						elem as ExIn<[...Schema][number]>,
						addCtxElement(ctx, {
							segment: index,
							side: CheckSide.Value,
						}) as ExArgs<[...Schema][number]>
					)
				)
			})
		).then((mapped) => reduce(mapped)) as Res
	}
}

export const tuple = <Schema extends [...Array<XisBase>]>(
	checks: [...Schema]
): XisTupleAsync<Schema> => new XisTupleAsync(checks)
