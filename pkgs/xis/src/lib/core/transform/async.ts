import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { XisExecArgs } from "#core/args.js"
import { type ExIn, type ExCtx, type ExIssues, type ExOut, type XisBase } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import { EitherAsync } from "purify-ts"
import { Effect } from "#core/book-keeping.js"
import type { XisTransformFn } from "./core.js"

export interface XisTransformAsyncProps<
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> {
	from: From
	fn: XisTransformFn<ExOut<From>, FnIssues, FnOut, FnCtx>
}

export interface XisTransformAsyncArgs<
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> {
	props: XisTransformAsyncProps<From, FnIssues, FnOut, FnCtx>
}

export class XisTransformAsync<
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
> extends XisAsync<
	ExIn<From>,
	ExIssues<From>,
	FnOut,
	typeof Effect.Transform,
	BuildObjArg<ExCtx<From>, FnCtx>
> {
	readonly #props

	constructor(args: XisTransformAsyncArgs<From, FnIssues, FnOut, FnCtx>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<ExIn<From>, BuildObjArg<ExCtx<From>, FnCtx>>
	): ExecResultAsync<ExIssues<From> | FnIssues, FnOut> {
		const { path, ctx, locale } = args
		return EitherAsync.fromPromise(() => Promise.resolve(this.#props.from.exec(args)))
			.chain((fromRes) =>
				Promise.resolve(
					this.#props.fn({
						value: fromRes,
						locale,
						path,
						ctx,
					})
				)
			)
			.run()
	}
}

export const transform = <
	From extends XisBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = null,
>(
	from: From,
	fn: XisTransformFn<ExOut<From>, FnIssues, FnOut, FnCtx>
): XisTransformAsync<From, FnIssues, FnOut, FnCtx> =>
	new XisTransformAsync<From, FnIssues, FnOut, FnCtx>({ props: { from, fn } })
