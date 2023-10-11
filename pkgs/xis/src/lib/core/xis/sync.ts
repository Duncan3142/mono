import type { XisBuildArgs, XisCtx, XisCtxBase, XisOptArgs } from "#core/context.js"
import {
	invoke,
	type ExInvoke,
	type InvokeMode,
	type ExIn,
	type ExCtx,
	type ExGuardIssues,
	type ExExecIssues,
	type ExOut,
	type ExArgs,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
	type XisSyncFn,
} from "#core/sync.js"

export class XisFnSync<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnArgs extends XisOptArgs = undefined,
> extends XisSync<
	ExIn<From>,
	ExGuardIssues<From>,
	ExExecIssues<From> | FnIssues,
	FnOut,
	XisBuildArgs<ExArgs<From>, FnArgs>
> {
	readonly #from: From
	readonly #fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnArgs>

	constructor(from: From, fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnArgs>) {
		super()
		this.#from = from
		this.#fn = fn
	}

	parse(
		value: unknown,
		ctx: XisCtx<XisBuildArgs<ExArgs<From>, FnArgs>>
	): ParseResultSync<ExGuardIssues<From>, ExExecIssues<From> | FnIssues, FnOut> {
		return this.#invoke("parse", value, ctx)
	}

	exec(
		value: ExIn<From>,
		ctx: XisCtx<XisBuildArgs<ExArgs<From>, FnArgs>>
	): ExecResultSync<ExExecIssues<From> | FnIssues, FnOut> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: unknown,
		ctx: XisCtxBase
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, InvokeMode>
		return invoke(mode, this.#from, value as ExIn<From>, ctx as ExCtx<From>).chain((fromRes) =>
			this.#fn(fromRes as ExOut<From>, ctx as ExCtx<this>)
		) as Res
	}
}

export const xis = <
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnArgs extends XisOptArgs = undefined,
>(
	from: From,
	fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnArgs>
): XisFnSync<From, FnIssues, FnOut, FnArgs> =>
	new XisFnSync<From, FnIssues, FnOut, FnArgs>(from, fn)
