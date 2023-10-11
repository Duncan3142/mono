import type { XisCtx } from "#core/context.js"
import {
	type UnionArgs,
	type UnionIssues,
	type UnionIn,
	type UnionOut,
	reduce,
} from "./core.js"
import type { XisBase } from "#core/kernel.js"
import { EitherAsync } from "purify-ts/EitherAsync"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"

export class XisUnionAsync<
	Schema extends [XisBase, XisBase, ...Array<XisBase>],
> extends XisAsync<
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

	async parse(
		value: unknown,
		ctx: XisCtx<UnionArgs<Schema>>
	): ParseResultAsync<UnionIssues<Schema>, UnionIssues<Schema>, UnionOut<Schema>> {
		type Res = Awaited<
			ParseResultAsync<UnionIssues<Schema>, UnionIssues<Schema>, UnionOut<Schema>>
		>

		const mapped = await Promise.all(
			this.#checks.map((chk) =>
				EitherAsync.fromPromise(() => Promise.resolve(chk.parse(value, ctx))).run()
			)
		)

		return reduce(mapped) as Res
	}

	exec(
		value: UnionIn<Schema>,
		ctx: XisCtx<UnionArgs<Schema>>
	): ExecResultAsync<UnionIssues<Schema>, UnionOut<Schema>> {
		return this.parse(value, ctx)
	}
}

export const union = <Schema extends [XisBase, XisBase, ...Array<XisBase>]>(
	checks: [...Schema]
): XisUnionAsync<Schema> => new XisUnionAsync(checks)
