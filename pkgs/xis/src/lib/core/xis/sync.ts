import type { XisArgs, XisBuildCtx, XisCtxBase } from "#core/context.js"
import {
	type ExIn,
	type ExCtx,
	type ExIssues,
	type ExMessages,
	type ExOut,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisSync, type ExecResultSync, type XisSyncBase, type XisSyncFn } from "#core/sync.js"
import type { XisBuildMessages, XisMessages } from "#core/prop.js"

export interface XisFnSyncProps<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
> {
	from: From
	fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnMessages, FnCtx>
}

export class XisFnSync<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
> extends XisSync<
	ExIn<From>,
	ExIssues<From>,
	FnOut,
	XisBuildMessages<ExMessages<From>, FnMessages>,
	XisBuildCtx<ExCtx<From>, FnCtx>
> {
	readonly #props

	constructor(props: XisFnSyncProps<From, FnIssues, FnOut, FnMessages, FnCtx>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArgs<
			ExIn<From>,
			XisBuildMessages<ExMessages<From>, FnMessages>,
			XisBuildCtx<ExCtx<From>, FnCtx>
		>
	): ExecResultSync<ExIssues<From> | FnIssues, FnOut> {
		const { path, messages, ctx } = args
		return this.#props.from.exec(args).chain((fromRes) =>
			this.#props.fn({
				value: fromRes,
				path,
				messages,
				ctx,
			})
		)
	}
}

export const xis = <
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
>(
	from: From,
	fn: XisSyncFn<ExOut<From>, FnIssues, FnOut, FnMessages, FnCtx>
): XisFnSync<From, FnIssues, FnOut, FnMessages, FnCtx> =>
	new XisFnSync<From, FnIssues, FnOut, FnMessages, FnCtx>({ from, fn })
