import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import { invoke, type ExInvoke, type InvokeMode, type ExIn } from "#core/kernel.js"
import {
	type ArrayIn,
	type ArrayGuardIssues,
	type ArrayExecIssues,
	type ArrayOut,
	type ArrayArgs,
	reduce,
} from "./core.js"
import { isBaseArray } from "#core/base-type.js"
import type { XisIssueBase } from "#core/error.js"

export class XisArraySync<Schema extends XisSyncBase> extends XisSync<
	ArrayIn<Schema>,
	ArrayGuardIssues<Schema>,
	ArrayExecIssues<Schema>,
	ArrayOut<Schema>,
	ArrayArgs<Schema>
> {
	readonly #check: Schema

	constructor(chk: Schema) {
		super()
		this.#check = chk
	}

	parse(
		value: unknown,
		ctx: XisCtx<ArrayArgs<Schema>>
	): ParseResultSync<ArrayGuardIssues<Schema>, ArrayExecIssues<Schema>, ArrayOut<Schema>> {
		return isBaseArray(value, ctx).chain((arr) => this.#invoke("parse", arr, ctx))
	}

	exec(
		value: ArrayIn<Schema>,
		ctx: XisCtx<ArrayArgs<Schema>>
	): ExecResultSync<ArrayExecIssues<Schema>, ArrayOut<Schema>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: Array<unknown>,
		ctx: XisCtx<ArrayArgs<Schema>>
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>

		const mapped = value.map<ExecResultSync<XisIssueBase, unknown>>((elem, index) =>
			invoke(
				mode,
				this.#check,
				elem as ExIn<Schema>,
				addCtxElement(ctx, {
					segment: index,
					side: CheckSide.Value,
				})
			)
		)
		return reduce(mapped) as Res
	}
}

export const array = <Schema extends XisSyncBase>(check: Schema): XisArraySync<Schema> =>
	new XisArraySync(check)
