import {
	xisListEffect,
	type ExIn,
	type ExOut,
	type XisBase,
	type XisListEffect,
	type XisListCtx,
	type XisListIssues,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"
import { XisAsync, type ExecResultAsync, type ExecEitherAsync } from "#core/async.js"
import type { XisChainIn, XisChainOut } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { EitherAsync } from "purify-ts"

type XisChainSchemaAsync<
	Chain extends [XisBase, ...Array<XisBase>],
	Remaining extends [...Array<XisBase>] = Chain,
> = Remaining extends [
	infer First extends XisBase,
	infer Second extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? [ExOut<First>] extends [ExIn<Second>]
		? XisChainSchemaAsync<Chain, [Second, ...Rest]>
		: never
	: Chain

export interface XisChainAsyncProps<Chain extends [XisBase, XisBase, ...Array<XisBase>]> {
	schema: [...XisChainSchemaAsync<Chain>]
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
	schema: [...XisChainSchemaAsync<Chain>]
): XisChainAsync<Chain> => new XisChainAsync({ props: { schema } })
