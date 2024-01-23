import { type ExIn, type ExCtx, type ExIssues, type ExOut } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisSync, type ExecResultSync, type XisSyncBase, type XisSyncFn } from "#core/sync.js"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { XisExecArgs } from "#core/args.js"

export interface XisFnSyncProps<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> {
	from: From
	fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnCtx>
}

export class XisFnSync<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> extends XisSync<ExIn<From>, ExIssues<From>, FnOut, BuildObjArg<ExCtx<From>, FnCtx>> {
	readonly #props

	constructor(props: XisFnSyncProps<From, FnIssues, FnOut, FnCtx>) {
		super()
		this.#props = props
	}

	exec(
		args: XisExecArgs<ExIn<From>, BuildObjArg<ExCtx<From>, FnCtx>>
	): ExecResultSync<ExIssues<From> | FnIssues, FnOut> {
		const { path, ctx } = args
		return this.#props.from.exec(args).chain((fromRes) =>
			this.#props.fn({
				value: fromRes,
				path,
				ctx,
			})
		)
	}
}

export const xis = <
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
>(
	from: From,
	fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnCtx>
): XisFnSync<From, FnIssues, FnOut, FnCtx> =>
	new XisFnSync<From, FnIssues, FnOut, FnCtx>({ from, fn })
