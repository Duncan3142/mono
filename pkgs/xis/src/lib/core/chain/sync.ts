import {
	xisListEffect,
	type XisListCtx,
	type XisListEffect,
	type XisListIssues,
} from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisChainIn, XisChainOut, XisChainSchema } from "./core.js"
import type { XisExecArgs } from "#core/args.js"

export interface XisChainSyncProps<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	schema: [...XisChainSchema<Chain>]
}

export interface XisChainSyncArgs<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	props: XisChainSyncProps<Chain>
}

export class XisChainSync<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	XisChainIn<Chain>,
	XisListIssues<Chain>,
	XisChainOut<Chain>,
	XisListEffect<Chain>,
	XisListCtx<Chain>
> {
	#props: XisChainSyncProps<Chain>

	constructor(args: XisChainSyncArgs<Chain>) {
		super()
		this.#props = args.props
	}

	override get effect(): XisListEffect<Chain> {
		return xisListEffect(this.#props.schema)
	}

	exec(
		args: XisExecArgs<XisChainIn<Chain>, XisListCtx<Chain>>
	): ExecResultSync<XisListIssues<Chain>, XisChainOut<Chain>> {
		const { path, ctx, locale } = args
		const [first, ...rest] = this.#props.schema
		const acc: ExecResultSync<XisIssueBase, unknown> = first.exec(args)

		return rest.reduce(
			(acc, xis) =>
				acc.chain((value) =>
					xis.exec({
						value,
						locale,
						path,
						ctx,
					})
				),
			acc
		) as ExecResultSync<XisListIssues<Chain>, XisChainOut<Chain>>
	}
}

export const chain = <Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	schema: [...XisChainSchema<Chain>]
): XisChainSync<Chain> => new XisChainSync({ props: { schema } })
