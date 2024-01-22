import { type ExIn, type ExOut } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type {
	XisChainCtx,
	XisChainMessages,
	XisChainIssues,
	XisChainIn,
	XisChainOut,
} from "./core.js"
import type { XisArg } from "#core/context.js"

type XisChainSchemaSync<
	Chain extends [XisSyncBase, ...Array<XisSyncBase>],
	Remaining extends [...Array<XisSyncBase>] = Chain,
> = Remaining extends [
	infer First extends XisSyncBase,
	infer Second extends XisSyncBase,
	...infer Rest extends Array<XisSyncBase>,
]
	? [ExOut<First>] extends [ExIn<Second>]
		? XisChainSchemaSync<Chain, [Second, ...Rest]>
		: never
	: Chain

export interface XisChainSyncProps<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	schema: [...XisChainSchemaSync<Chain>]
}

export class XisChainSync<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	XisChainIn<Chain>,
	XisChainIssues<Chain>,
	XisChainOut<Chain>,
	XisChainMessages<Chain>,
	XisChainCtx<Chain>
> {
	#props: XisChainSyncProps<Chain>

	constructor(props: XisChainSyncProps<Chain>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArg<XisChainIn<Chain>, XisChainMessages<Chain>, XisChainCtx<Chain>>
	): ExecResultSync<XisChainIssues<Chain>, XisChainOut<Chain>> {
		const { path, messages, ctx } = args
		const [first, ...rest] = this.#props.schema
		const acc: ExecResultSync<XisIssueBase, unknown> = first.exec(args)

		return rest.reduce(
			(acc, xis) =>
				acc.chain((value) =>
					xis.exec({
						value,
						path,
						messages,
						ctx,
					})
				),
			acc
		) as ExecResultSync<XisChainIssues<Chain>, XisChainOut<Chain>>
	}
}

export const chain = <Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	schema: [...XisChainSchemaSync<Chain>]
): XisChainSync<Chain> => new XisChainSync({ schema })
