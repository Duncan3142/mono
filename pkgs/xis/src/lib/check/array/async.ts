import { CheckSide, addElement } from "#core/path.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import { type ArrayIn, type ArrayIssues, type ArrayOut, type ArrayCtx, reduce } from "./core.js"
import type { XisIssueBase } from "#core/error.js"
import type { XisExecArgs } from "#core/args.js"
import type { XisBase } from "#core/kernel.js"

export interface XisArrayAsyncProps<Schema extends XisBase> {
	check: Schema
}

export type ArrayAsyncArgs<Schema extends XisBase> = {
	props: XisArrayAsyncProps<Schema>
}

export class XisArrayAsync<Schema extends XisBase> extends XisAsync<
	ArrayIn<Schema>,
	ArrayIssues<Schema>,
	ArrayOut<Schema>,
	ArrayCtx<Schema>
> {
	#props: XisArrayAsyncProps<Schema>

	constructor(args: ArrayAsyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	async exec(
		args: XisExecArgs<ArrayIn<Schema>, ArrayCtx<Schema>>
	): ExecResultAsync<ArrayIssues<Schema>, ArrayOut<Schema>> {
		const { value, locale, path, ctx } = args
		const { check } = this.#props

		const mapped = await Promise.all(
			value.map<ExecResultAsync<XisIssueBase, unknown>>((elem, index) =>
				Promise.resolve(
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
			)
		)
		return reduce(mapped)
	}
}

export const array = <Schema extends XisBase>(
	args: ArrayAsyncArgs<Schema>
): XisArrayAsync<Schema> => new XisArrayAsync(args)
