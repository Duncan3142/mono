import { type ExIn, type ExOut, type XisBase } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

import { XisAsync, type ExecResultAsync, type ExecEitherAsync } from "#core/async.js"
import type {
	XisChainCtx,
	XisChainMessages,
	XisChainIssues,
	XisChainIn,
	XisChainOut,
} from "./core.js"
import type { XisArg } from "#core/context.js"
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

export class XisChainAsync<
	Chain extends [XisBase, XisBase, ...Array<XisBase>],
> extends XisAsync<
	XisChainIn<Chain>,
	XisChainIssues<Chain>,
	XisChainOut<Chain>,
	XisChainMessages<Chain>,
	XisChainCtx<Chain>
> {
	#props: XisChainAsyncProps<Chain>

	constructor(props: XisChainAsyncProps<Chain>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArg<XisChainIn<Chain>, XisChainMessages<Chain>, XisChainCtx<Chain>>
	): ExecResultAsync<XisChainIssues<Chain>, XisChainOut<Chain>> {
		const { path, messages, ctx } = args
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
								path,
								messages,
								ctx,
							})
						)
					),
				acc
			)
			.run() as ExecResultAsync<XisChainIssues<Chain>, XisChainOut<Chain>>
	}
}

export const chain = <Chain extends [XisBase, XisBase, ...Array<XisBase>]>(
	schema: [...XisChainSchemaAsync<Chain>]
): XisChainAsync<Chain> => new XisChainAsync({ schema })
