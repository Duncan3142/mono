import { CheckSide, addElement } from "#core/path.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import { type ArrayIn, type ArrayIssues, type ArrayOut, type ArrayCtx, reduce } from "./core.js"
import type { XisIssueBase } from "#core/error.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"

export interface XisArraySyncProps<Schema extends XisSyncBase> {
	check: Schema
}

export type ArraySyncArgs<Schema extends XisSyncBase> = {
	props: XisArraySyncProps<Schema>
}

export class XisArraySync<Schema extends XisSyncBase> extends XisSync<
	ArrayIn<Schema>,
	ArrayIssues<Schema>,
	ArrayOut<Schema>,
	typeof Effect.Transform,
	ArrayCtx<Schema>
> {
	#props: XisArraySyncProps<Schema>

	constructor(args: ArraySyncArgs<Schema>) {
		super()
		this.#props = args.props
	}
	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	exec(
		args: XisExecArgs<ArrayIn<Schema>, ArrayCtx<Schema>>
	): ExecResultSync<ArrayIssues<Schema>, ArrayOut<Schema>> {
		const { value, locale, path, ctx } = args
		const { check } = this.#props

		const mapped = value.map<ExecResultSync<XisIssueBase, unknown>>((elem, index) =>
			check.exec({
				value: elem,
				locale,
				ctx,
				path: addElement(path, {
					segment: index,
					side: CheckSide.Value,
				}),
			})
		)
		return reduce(mapped)
	}
}

export const array = <Schema extends XisSyncBase>(
	args: ArraySyncArgs<Schema>
): XisArraySync<Schema> => new XisArraySync(args)
