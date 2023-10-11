import { EitherAsync } from "purify-ts/EitherAsync"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import type { XisBuildArgs, XisCtx, XisCtxBase, XisOptArgs } from "#core/context.js"
import {
	invoke,
	InvokeMode,
	type ExInvoke,
	type XisFn,
	type ExIn,
	type ExCtx,
	type XisBase,
	type ExArgs,
	type ExGuardIssues,
	type ExExecIssues,
	type ExOut,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

export class XisFnAsync<
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnArgs extends XisOptArgs = undefined,
> extends XisAsync<
	ExIn<From>,
	ExGuardIssues<From>,
	ExExecIssues<From> | FnIssues,
	FnOut,
	XisBuildArgs<ExArgs<From>, FnArgs>
> {
	readonly #from: From
	readonly #fn: XisFn<ExOut<From>, FnIssues, FnOut, FnArgs>

	constructor(from: From, fn: XisFn<ExOut<From>, FnIssues, FnOut, FnArgs>) {
		super()
		this.#from = from
		this.#fn = fn
	}

	parse(
		value: unknown,
		ctx: XisCtx<XisBuildArgs<ExArgs<From>, FnArgs>>
	): ParseResultAsync<ExGuardIssues<From>, ExExecIssues<From> | FnIssues, FnOut> {
		return this.#invoke("parse", value, ctx)
	}

	exec(
		value: ExIn<From>,
		ctx: XisCtx<XisBuildArgs<ExArgs<From>, FnArgs>>
	): ExecResultAsync<ExExecIssues<From> | FnIssues, FnOut> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: unknown,
		ctx: XisCtxBase
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>
		return EitherAsync.fromPromise(() =>
			Promise.resolve(invoke(mode, this.#from, value as ExIn<From>, ctx as ExCtx<From>))
		)
			.chain((fromRes) => Promise.resolve(this.#fn(fromRes as ExOut<From>, ctx as ExCtx<this>)))
			.run() as Res
	}
}

export const xis = <
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnArgs extends XisOptArgs = undefined,
>(
	from: From,
	fn: XisFn<ExOut<From>, FnIssues, FnOut, FnArgs>
): XisFnAsync<From, FnIssues, FnOut, FnArgs> =>
	new XisFnAsync<From, FnIssues, FnOut, FnArgs>(from, fn)
