import type { XisCtx } from "#core/context.js"

import type { ExIn, ExGuardIssues, ExExecIssues, ExOut, ExArgs } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import type { XisSyncBase } from "./sync.js"

export class XisLift<X extends XisSyncBase> extends XisAsync<
	ExIn<X>,
	ExGuardIssues<X>,
	ExExecIssues<X>,
	ExOut<X>,
	ExArgs<X>
> {
	#inner: X

	constructor(inner: X) {
		super()
		this.#inner = inner
	}

	parse(
		value: unknown,
		ctx: XisCtx<ExArgs<X>>
	): ParseResultAsync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>> {
		type Res = ParseResultAsync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>>
		return Promise.resolve(this.#inner.parse(value, ctx)) as Res
	}

	exec(value: ExIn<X>, ctx: XisCtx<ExArgs<X>>): ExecResultAsync<ExExecIssues<X>, ExOut<X>> {
		type Res = ExecResultAsync<ExExecIssues<X>, ExOut<X>>
		return Promise.resolve(this.#inner.exec(value, ctx)) as Res
	}
}

export const lift = <X extends XisSyncBase>(inner: X): XisLift<X> => new XisLift(inner)
