import type { XisArg, XisBuildCtx, XisCtxBase } from "#core/context.js"
import {
	type ExIn,
	type ExCtx,
	type ExIssues,
	type ExMessages,
	type ExOut,
	type XisFn,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisAsync, type ExecResultAsync, type XisAsyncBase } from "#core/async.js"
import type { XisBuildMessages, XisMessages } from "#core/prop.js"
import { EitherAsync } from "purify-ts"

export interface XisFnAsyncProps<
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
> {
	from: From
	fn: XisFn<ExOut<From>, FnIssues, FnOut, FnMessages, FnCtx>
}

export class XisFnAsync<
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
> extends XisAsync<
	ExIn<From>,
	ExIssues<From>,
	FnOut,
	XisBuildMessages<ExMessages<From>, FnMessages>,
	XisBuildCtx<ExCtx<From>, FnCtx>
> {
	readonly #props

	constructor(props: XisFnAsyncProps<From, FnIssues, FnOut, FnMessages, FnCtx>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArg<
			ExIn<From>,
			XisBuildMessages<ExMessages<From>, FnMessages>,
			XisBuildCtx<ExCtx<From>, FnCtx>
		>
	): ExecResultAsync<ExIssues<From> | FnIssues, FnOut> {
		const { path, messages, ctx } = args
		return EitherAsync.fromPromise(() => this.#props.from.exec(args))
			.chain((fromRes) =>
				Promise.resolve(
					this.#props.fn({
						value: fromRes,
						path,
						messages,
						ctx,
					})
				)
			)
			.run()
	}
}

export const xis = <
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnMessages extends XisMessages<FnIssues> = null,
	FnCtx extends XisCtxBase = null,
>(
	from: From,
	fn: XisFn<ExOut<From>, FnIssues, FnOut, FnMessages, FnCtx>
): XisFnAsync<From, FnIssues, FnOut, FnMessages, FnCtx> =>
	new XisFnAsync<From, FnIssues, FnOut, FnMessages, FnCtx>({ from, fn })
