import { type ExIn, type ExCtx, type ExIssues, type ExOut } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisTransformSyncFn } from "./core.js"

export interface XisTransformSyncProps<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = ObjArgBase,
> {
	from: From
	fn: XisTransformSyncFn<ExOut<From>, FnIssues, FnOut, FnCtx>
}

export interface XisTransformSyncArgs<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = ObjArgBase,
> {
	props: XisTransformSyncProps<From, FnIssues, FnOut, FnCtx>
}

export class XisTransformSync<
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = ObjArgBase,
> extends XisSync<
	ExIn<From>,
	ExIssues<From>,
	FnOut,
	typeof Effect.Transform,
	BuildObjArg<ExCtx<From>, FnCtx>
> {
	readonly #props

	constructor(args: XisTransformSyncArgs<From, FnIssues, FnOut, FnCtx>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<ExIn<From>, BuildObjArg<ExCtx<From>, FnCtx>>
	): ExecResultSync<ExIssues<From> | FnIssues, FnOut> {
		const { path, ctx, locale } = args
		return this.#props.from.exec(args).chain((fromRes) =>
			this.#props.fn({
				value: fromRes,
				locale,
				path,
				ctx,
			})
		)
	}
}

export const transform = <
	From extends XisSyncBase,
	FnIssues extends XisIssueBase = never,
	FnOut = ExOut<From>,
	FnCtx extends ObjArgBase = ObjArgBase,
>(
	from: From,
	fn: XisTransformSyncFn<ExOut<From>, FnIssues, FnOut, FnCtx>
): XisTransformSync<From, FnIssues, FnOut, FnCtx> =>
	new XisTransformSync<From, FnIssues, FnOut, FnCtx>({ props: { from, fn } })
