import type { XisCtx } from "#core/context.js"

import type { ExIn, ExGuardIssues, ExExecIssues, ExOut, ExArgs } from "#core/kernel.js"
import {
	XisAsync,
	type ExecResultAsync,
	type ParseResultAsync,
	type XisAsyncBase,
} from "#core/async.js"

export class XisLazyAsync<X extends XisAsyncBase> extends XisAsync<
	ExIn<X>,
	ExGuardIssues<X>,
	ExExecIssues<X>,
	ExOut<X>,
	ExArgs<X>
> {
	#lazy: () => X

	constructor(lazy: () => X) {
		super()
		this.#lazy = lazy
	}

	parse(
		value: unknown,
		ctx: XisCtx<ExArgs<X>>
	): ParseResultAsync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>> {
		type Res = ParseResultAsync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>>
		return this.#lazy().parse(value, ctx) as Res
	}

	exec(value: ExIn<X>, ctx: XisCtx<ExArgs<X>>): ExecResultAsync<ExExecIssues<X>, ExOut<X>> {
		type Res = ExecResultAsync<ExExecIssues<X>, ExOut<X>>
		return this.#lazy().exec(value, ctx) as Res
	}
}

export const lazy = <X extends XisAsyncBase>(lazy: () => X): XisLazyAsync<X> =>
	new XisLazyAsync(lazy)
