import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import {
	invoke,
	type ExInvoke,
	type InvokeMode,
	type ExIn,
	type XisBase,
} from "#core/kernel.js"
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
import { EitherAsync } from "purify-ts/EitherAsync"

export class XisArrayAsync<Schema extends XisBase> extends XisAsync<
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
	): ParseResultAsync<ArrayGuardIssues<Schema>, ArrayExecIssues<Schema>, ArrayOut<Schema>> {
		return EitherAsync.liftEither(isBaseArray(value, ctx))
			.chain((arr) => this.#invoke("parse", arr, ctx))
			.run()
	}

	exec(
		value: ArrayIn<Schema>,
		ctx: XisCtx<ArrayArgs<Schema>>
	): ExecResultAsync<ArrayExecIssues<Schema>, ArrayOut<Schema>> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: Array<unknown>,
		ctx: XisCtx<ArrayArgs<Schema>>
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>

		return Promise.all(
			value.map<ExecResultAsync<XisIssueBase, unknown>>((elem, index) =>
				Promise.resolve(
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
			)
		).then((mapped) => reduce(mapped)) as Res
	}
}

export const array = <Schema extends XisBase>(check: Schema): XisArrayAsync<Schema> =>
	new XisArrayAsync(check)
