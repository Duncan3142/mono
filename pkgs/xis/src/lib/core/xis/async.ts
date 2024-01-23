import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { XisExecArgs } from "#core/args.js"
import { type ExIn, type ExCtx, type ExIssues, type ExOut, type XisFn } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisAsync, type ExecResultAsync, type XisAsyncBase } from "#core/async.js"
import { EitherAsync } from "purify-ts"

export interface XisFnAsyncProps<
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> {
	from: From
	fn: XisFn<ExOut<From>, FnIssues, FnOut, FnCtx>
}

export interface XisFnAsyncArgs<
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> {
	props: XisFnAsyncProps<From, FnIssues, FnOut, FnCtx>
}

export class XisFnAsync<
	From extends XisAsyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> extends XisAsync<ExIn<From>, ExIssues<From>, FnOut, BuildObjArg<ExCtx<From>, FnCtx>> {
	readonly #props

	constructor(args: XisFnAsyncArgs<From, FnIssues, FnOut, FnCtx>) {
		super()
		this.#props = args.props
	}

	exec(
		args: XisExecArgs<ExIn<From>, BuildObjArg<ExCtx<From>, FnCtx>>
	): ExecResultAsync<ExIssues<From> | FnIssues, FnOut> {
		const { path, ctx } = args
		return EitherAsync.fromPromise(() => this.#props.from.exec(args))
			.chain((fromRes) =>
				Promise.resolve(
					this.#props.fn({
						value: fromRes,
						path,
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
	FnCtx extends ObjArgBase = null,
>(
	from: From,
	fn: XisFn<ExOut<From>, FnIssues, FnOut, FnCtx>
): XisFnAsync<From, FnIssues, FnOut, FnCtx> =>
	new XisFnAsync<From, FnIssues, FnOut, FnCtx>({ props: { from, fn } })
