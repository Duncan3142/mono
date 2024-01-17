import {
	type TupleArgs,
	type TupleExecIssues,
	type TupleGuardIssues,
	type TupleIn,
	type TupleOut,
	reduce,
} from "./core.js"
import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import type { XisIssueBase } from "#core/error.js"
import { isTupleOf } from "#core/base-type.js"
import { invoke, type ExInvoke, type InvokeMode, type ExIn, type ExArgs } from "#core/kernel.js"

export class XisTupleSync<Schema extends [...Array<XisSyncBase>]> extends XisSync<
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
	): ParseResultSync<TupleGuardIssues<Schema>, TupleExecIssues<Schema>, TupleOut<Schema>> {
		return isTupleOf(value, this.#checks.length, ctx).chain((arr) =>
			this.#invoke("parse", arr, ctx)
		)
	}

	exec(
		value: TupleIn<Schema>,
		ctx: XisCtx<TupleArgs<Schema>>
	): ExecResultSync<TupleExecIssues<Schema>, TupleOut<Schema>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: Array<unknown>,
		ctx: XisCtx<TupleArgs<Schema>>
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>

		const mapped = value.map<ExecResultSync<XisIssueBase, unknown>>((elem, index) => {
			const check = this.#checks[index]
			return invoke(
				mode,
				check,
				elem as ExIn<[...Schema][number]>,
				addCtxElement(ctx, {
					segment: index,
					side: CheckSide.Value,
				}) as ExArgs<[...Schema][number]>
			)
		})
		return reduce(mapped) as Res
	}
}

export const tuple = <Schema extends [...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisTupleSync<Schema> => new XisTupleSync(checks)
