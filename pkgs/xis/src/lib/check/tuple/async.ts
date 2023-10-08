import { type TupleIn, type TupleOut, reduce } from "./core.js"
import { CheckSide, addElement } from "#core/path.js"
import type { XisExecArgs } from "#core/args.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisIssueBase } from "#core/error.js"
import type { XisBase, XisListCtx, XisListIssues } from "#core/kernel.js"
import type { ExecResultSync } from "#core/sync.js"
import { Effect } from "#core/book-keeping.js"

export interface XisTupleAsyncProps<Schema extends [...Array<XisBase>]> {
	checks: [...Schema]
}

export interface XisTupleAsyncArgs<Schema extends [...Array<XisBase>]> {
	props: XisTupleAsyncProps<Schema>
}

export class XisTupleAsync<Schema extends [...Array<XisBase>]> extends XisAsync<
	TupleIn<Schema>,
	XisListIssues<Schema>,
	TupleOut<Schema>,
	typeof Effect.Transform,
	XisListCtx<Schema>
> {
	#props: XisTupleAsyncProps<Schema>

	constructor(args: XisTupleAsyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	async exec(
		args: XisExecArgs<TupleIn<Schema>, XisListCtx<Schema>>
	): ExecResultAsync<XisListIssues<Schema>, TupleOut<Schema>> {
		const { value, path, ctx, locale } = args
		const { checks } = this.#props
		const mapped = await Promise.all(
			value.map<ExecResultAsync<XisIssueBase, unknown>>((elem, index) => {
				const check = checks[index]
				return Promise.resolve(
					check.exec({
						value: elem,
						locale,
						path: addElement(path, {
							segment: index,
							side: CheckSide.Value,
						}),
						ctx,
					})
				)
			})
		)
		return reduce(mapped) as ExecResultSync<XisListIssues<Schema>, TupleOut<Schema>>
	}
}

export const tuple = <Schema extends [...Array<XisBase>]>(
	checks: [...Schema]
): XisTupleAsync<Schema> => new XisTupleAsync({ props: { checks } })
