import type { XisExecArgs } from "#core/args.js"
import {
	xisListEffect,
	type XisListCtx,
	type XisListEffect,
	type XisListIssues,
	type ExIn,
} from "#core/kernel.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { Same } from "#util/base-type.js"
import { type UnionIn, type UnionOut, reduce } from "./core.js"

type XisUnionSchemaSync<
	Union extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
	Remaining extends [...Array<XisSyncBase>] = Union,
> = Remaining extends [
	infer First extends XisSyncBase,
	infer Second extends XisSyncBase,
	...infer Rest extends Array<XisSyncBase>,
]
	? [Same<ExIn<First>, ExIn<Second>>] extends [true]
		? XisUnionSchemaSync<Union, [Second, ...Rest]>
		: never
	: Union

export interface XisUnionSyncProps<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	checks: [...XisUnionSchemaSync<Schema>]
}

export interface XisUnionSyncArgs<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> {
	props: XisUnionSyncProps<Schema>
}

export class XisUnionSync<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	UnionIn<Schema, ExIn<Schema[0]>>,
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
		args: XisExecArgs<UnionIn<Schema, ExIn<Schema[0]>>, XisListCtx<Schema>>
	): ExecResultSync<XisListIssues<Schema>, UnionOut<Schema>> {
		const mapped = this.#props.checks.map((chk) => chk.exec(args))

		return reduce(mapped) as ExecResultSync<XisListIssues<Schema>, UnionOut<Schema>>
	}
}

export const union = <Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	checks: [...XisUnionSchemaSync<Schema>]
): XisUnionSync<Schema> => new XisUnionSync({ props: { checks } })
