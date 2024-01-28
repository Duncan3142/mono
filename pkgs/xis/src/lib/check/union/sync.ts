import type { XisExecArgs } from "#core/args.js"
import {
	xisListEffect,
	type XisListCtx,
	type XisListEffect,
	type XisListIssues,
} from "#core/kernel.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import { type UnionIn, type UnionOut, reduce } from "./core.js"

export interface XisUnionSyncProps<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	checks: [...Schema]
}

export interface XisUnionSyncArgs<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	props: XisUnionSyncProps<Schema>
}

export class XisUnionSync<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	UnionIn<Schema>,
	XisListIssues<Schema>,
	UnionOut<Schema>,
	XisListEffect<Schema>,
	XisListCtx<Schema>
> {
	#props: XisUnionSyncProps<Schema>

	constructor(args: XisUnionSyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): XisListEffect<Schema> {
		return xisListEffect(this.#props.checks)
	}

	exec(
		args: XisExecArgs<UnionIn<Schema>, XisListCtx<Schema>>
	): ExecResultSync<XisListIssues<Schema>, UnionOut<Schema>> {
		const mapped = this.#props.checks.map((chk) => chk.exec(args))

		return reduce(mapped) as ExecResultSync<XisListIssues<Schema>, UnionOut<Schema>>
	}
}

export const union = <Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisUnionSync<Schema> => new XisUnionSync({ props: { checks } })
