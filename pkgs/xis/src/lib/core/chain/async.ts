import {
	xisListEffect,
	type XisBase,
	type XisListEffect,
	type XisListCtx,
	type XisListIssues,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisAsync, type ExecResultAsync, type ExecEitherAsync } from "#core/async.js"
import type { XisChainIn, XisChainOut, XisChainSchema } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { EitherAsync } from "purify-ts"

export interface XisChainAsyncProps<Chain extends [XisBase, XisBase, ...Array<XisBase>]> {
	schema: [...XisChainSchema<Chain>]
}

export interface XisChainAsyncArgs<Chain extends [XisBase, XisBase, ...Array<XisBase>]> {
	props: XisChainAsyncProps<Chain>
}

export class XisChainAsync<
	Chain extends [XisBase, XisBase, ...Array<XisBase>],
> extends XisAsync<
	XisChainIn<Chain>,
	XisListIssues<Chain>,
	XisChainOut<Chain>,
	XisListEffect<Chain>,
	XisListCtx<Chain>
> {
	#props: XisChainAsyncProps<Chain>

	constructor(args: XisChainAsyncArgs<Chain>) {
		super()
		this.#props = args.props
	}

	override get effect(): XisListEffect<Chain> {
		return xisListEffect(this.#props.schema)
	}

	exec(
		args: XisExecArgs<XisChainIn<Chain>, XisListCtx<Chain>>
	): ExecResultAsync<XisListIssues<Chain>, XisChainOut<Chain>> {
		const { path, ctx, locale } = args
		const [first, ...rest] = this.#props.schema
		const acc: ExecEitherAsync<XisIssueBase, unknown> = EitherAsync.fromPromise(() =>
			Promise.resolve(first.exec(args))
		)

		return rest
			.reduce(
				(acc, xis) =>
					acc.chain((value) =>
						Promise.resolve(
							xis.exec({
								value,
								locale,
								path,
								ctx,
							})
						)
					),
				acc
			)
			.run() as ExecResultAsync<XisListIssues<Chain>, XisChainOut<Chain>>
	}
}

export const chain = <Chain extends [XisBase, XisBase, ...Array<XisBase>]>(
	schema: [...XisChainSchema<Chain>]
): XisChainAsync<Chain> => new XisChainAsync({ props: { schema } })
