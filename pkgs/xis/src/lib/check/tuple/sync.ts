import { type TupleIn, type TupleOut, reduce } from "./core.js"
import { CheckSide, addElement } from "#core/path.js"
import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisIssueBase } from "#core/error.js"
import { Effect } from "#core/book-keeping.js"
import type { XisListCtx, XisListIssues } from "#core/kernel.js"

export interface XisTupleSyncProps<Schema extends [...Array<XisSyncBase>]> {
	checks: [...Schema]
}

export interface XisTupleSyncArgs<Schema extends [...Array<XisSyncBase>]> {
	props: XisTupleSyncProps<Schema>
}

export class XisTupleSync<Schema extends [...Array<XisSyncBase>]> extends XisSync<
	TupleIn<Schema>,
	XisListIssues<Schema>,
	TupleOut<Schema>,
	typeof Effect.Transform,
	XisListCtx<Schema>
> {
	#props: XisTupleSyncProps<Schema>

	constructor(args: XisTupleSyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<TupleIn<Schema>, XisListCtx<Schema>>
	): ExecResultSync<XisListIssues<Schema>, TupleOut<Schema>> {
		const { value, path, ctx, locale } = args
		const { checks } = this.#props
		const mapped = value.map<ExecResultSync<XisIssueBase, unknown>>((elem, index) => {
			const check = checks[index]
			return check.exec({
				value: elem,
				locale,
				path: addElement(path, {
					segment: index,
					side: CheckSide.Value,
				}),
				ctx,
			})
		})
		return reduce(mapped) as ExecResultSync<XisListIssues<Schema>, TupleOut<Schema>>
	}
}

export const tuple = <Schema extends [...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisTupleSync<Schema> => new XisTupleSync({ props: { checks } })
