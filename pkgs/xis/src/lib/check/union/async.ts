import type { XisExecArgs } from "#core/args.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import {
	xisListEffect,
	type XisBase,
	type XisListCtx,
	type XisListEffect,
	type XisListIssues,
	type ExIn,
} from "#core/kernel.js"
import { EitherAsync } from "purify-ts/EitherAsync"
import { type UnionIn, type UnionOut, reduce } from "./core.js"
import type { ExecResultSync } from "#core/sync.js"
import type { Same } from "#util/base-type.js"

type XisUnionSchemaAsync<
	Union extends [XisBase, XisBase, ...Array<XisBase>],
	Remaining extends [...Array<XisBase>] = Union,
> = Remaining extends [
	infer First extends XisBase,
	infer Second extends XisBase,
	...infer Rest extends Array<XisBase>,
]
	? [Same<ExIn<First>, ExIn<Second>>] extends [true]
		? XisUnionSchemaAsync<Union, [Second, ...Rest]>
		: never
	: Union

export interface XisUnionAsyncProps<Schema extends [XisBase, XisBase, ...Array<XisBase>]> {
	checks: [...XisUnionSchemaAsync<Schema>]
}

export interface XisUnionAsyncArgs<Schema extends [XisBase, XisBase, ...Array<XisBase>]> {
	props: XisUnionAsyncProps<Schema>
}

export class XisUnionAsync<
	Schema extends [XisBase, XisBase, ...Array<XisBase>],
> extends XisAsync<
	UnionIn<Schema, ExIn<Schema[0]>>,
	XisListIssues<Schema>,
	UnionOut<Schema>,
	XisListEffect<Schema>,
	XisListCtx<Schema>
> {
	#props: XisUnionAsyncProps<Schema>

	constructor(args: XisUnionAsyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): XisListEffect<Schema> {
		return xisListEffect(this.#props.checks)
	}

	async exec(
		args: XisExecArgs<UnionIn<Schema, ExIn<Schema[0]>>, XisListCtx<Schema>>
	): ExecResultAsync<XisListIssues<Schema>, UnionOut<Schema>> {
		const mapped = await Promise.all(
			this.#props.checks.map((chk) =>
				EitherAsync.fromPromise(() => Promise.resolve(chk.exec(args))).run()
			)
		)

		return reduce(mapped) as ExecResultSync<XisListIssues<Schema>, UnionOut<Schema>>
	}
}

export const union = <Schema extends [XisBase, XisBase, ...Array<XisBase>]>(
	checks: [...XisUnionSchemaAsync<Schema>]
): XisUnionAsync<Schema> => new XisUnionAsync({ props: { checks } })
