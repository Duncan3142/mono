import type { XisCtx } from "#core/context.js"

import type { ExIn, ExGuardIssues, ExExecIssues, ExOut, ExArgs } from "#core/kernel.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"

export class XisLazySync<X extends XisSyncBase> extends XisSync<
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
	): ParseResultSync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>> {
		type Res = ParseResultSync<ExGuardIssues<X>, ExExecIssues<X>, ExOut<X>>
		return this.#lazy().parse(value, ctx) as Res
	}

	exec(value: ExIn<X>, ctx: XisCtx<ExArgs<X>>): ExecResultSync<ExExecIssues<X>, ExOut<X>> {
		type Res = ExecResultSync<ExExecIssues<X>, ExOut<X>>
		return this.#lazy().exec(value, ctx) as Res
	}
}

export const lazy = <X extends XisSyncBase>(lazy: () => X): XisLazySync<X> =>
	new XisLazySync(lazy)
