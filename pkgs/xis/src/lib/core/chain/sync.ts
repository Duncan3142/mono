import { type ExIn, type ExOut } from "#core/kernel.js"
import type { XisIssueBase } from "#core/error.js"

import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisChainCtx, XisChainIssues, XisChainIn, XisChainOut } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"

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

export interface XisChainSyncArgs<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	props: XisChainSyncProps<Chain>
}

export class XisChainSync<
	Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	XisChainIn<Chain>,
	XisChainIssues<Chain>,
	XisChainOut<Chain>,
	XisChainCtx<Chain>
> {
	#props: XisChainSyncProps<Chain>

	constructor(args: XisChainSyncArgs<Chain>) {
		super()
		this.#props = args.props
	}

	override get effect(): Effect {
		return this.#props.schema.reduce<Effect>(
			(acc, x) => (acc === Effect.Transform ? acc : x.effect),
			Effect.Validate
		)
	}

	exec(
		args: XisExecArgs<XisChainIn<Chain>, XisChainCtx<Chain>>
	): ExecResultSync<XisChainIssues<Chain>, XisChainOut<Chain>> {
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
		) as ExecResultSync<XisChainIssues<Chain>, XisChainOut<Chain>>
	}
}

export const chain = <Chain extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	schema: [...XisChainSchemaSync<Chain>]
): XisChainSync<Chain> => new XisChainSync({ props: { schema } })
