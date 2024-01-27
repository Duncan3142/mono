import { type TupleIn, type TupleOut, reduce, type TupleIssues, type TupleCtx } from "./core.js"
import { CheckSide, addElement } from "#core/path.js"
import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisIssueBase } from "#core/error.js"
import { Effect } from "#core/book-keeping.js"

export interface XisTupleSyncProps<Schema extends [...Array<XisSyncBase>]> {
	checks: [...Schema]
}

export interface XisTupleSyncArgs<Schema extends [...Array<XisSyncBase>]> {
	props: XisTupleSyncProps<Schema>
}

export class XisTupleSync<Schema extends [...Array<XisSyncBase>]> extends XisSync<
	TupleIn<Schema>,
	TupleIssues<Schema>,
	TupleOut<Schema>,
	TupleCtx<Schema>
> {
	#props: XisTupleSyncProps<Schema>

	constructor(args: XisTupleSyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): Effect {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<TupleIn<Schema>, TupleCtx<Schema>>
	): ExecResultSync<TupleIssues<Schema>, TupleOut<Schema>> {
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
		return reduce(mapped) as ExecResultSync<TupleIssues<Schema>, TupleOut<Schema>>
	}
}

export const tuple = <Schema extends [...Array<XisSyncBase>]>(
	checks: [...Schema]
): XisTupleSync<Schema> => new XisTupleSync({ props: { checks } })
