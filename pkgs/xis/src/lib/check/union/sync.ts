import type { XisCtx } from "#core/context.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import {
	type UnionArgs,
	type UnionIssues,
	type UnionIn,
	type UnionOut,
	reduce,
} from "./core.js"

export class XisUnionSync<
	Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>],
> extends XisSync<
	UnionIn<Schema>,
	UnionIssues<Schema>,
	UnionIssues<Schema>,
	UnionOut<Schema>,
	UnionArgs<Schema>
> {
	readonly #checks: [...Schema]

	constructor(chks: [...Schema]) {
		super()
		this.#checks = chks
	}

	parse(
		value: unknown,
		ctx: XisCtx<UnionArgs<Schema>>
	): ParseResultSync<UnionIssues<Schema>, UnionIssues<Schema>, UnionOut<Schema>> {
		type Res = ParseResultSync<UnionIssues<Schema>, UnionIssues<Schema>, UnionOut<Schema>>

		const mapped = this.#checks.map((chk) => chk.parse(value, ctx))

		return reduce(mapped) as Res
	}

	exec(
		value: UnionIn<Schema>,
		ctx: XisCtx<UnionArgs<Schema>>
	): ExecResultSync<UnionIssues<Schema>, UnionOut<Schema>> {
		return this.parse(value, ctx)
	}
}

export const union = <Schema extends [XisSyncBase, XisSyncBase, ...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisUnionSync<Schema> => new XisUnionSync(checks)
