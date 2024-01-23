import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import { type UnionCtx, type UnionIssues, type UnionIn, type UnionOut, reduce } from "./core.js"

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
> extends XisSync<UnionIn<Schema>, UnionIssues<Schema>, UnionOut<Schema>, UnionCtx<Schema>> {
	#props: XisUnionSyncProps<Schema>

	constructor(args: XisUnionSyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	exec(
		args: XisExecArgs<UnionIn<Schema>, UnionCtx<Schema>>
	): ExecResultSync<UnionIssues<Schema>, UnionOut<Schema>> {
		const mapped = this.#props.checks.map((chk) => chk.exec(args))

		return reduce(mapped) as ExecResultSync<UnionIssues<Schema>, UnionOut<Schema>>
	}
}

export const union = <Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisUnionSync<Schema> => new XisUnionSync({ props: { checks } })
