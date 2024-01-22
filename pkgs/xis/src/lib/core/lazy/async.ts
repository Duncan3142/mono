import type { XisArgs } from "#core/context.js"

import type { ExIn, ExIssues, ExOut, ExMessages, ExCtx } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync, type XisAsyncBase } from "#core/async.js"

interface XisLazyAsyncProps<X extends XisAsyncBase> {
	lazy: () => X
}

export class XisLazyAsync<X extends XisAsyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExMessages<X>,
	ExCtx<X>
> {
	#props: XisLazyAsyncProps<X>

	constructor(props: XisLazyAsyncProps<X>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArgs<ExIn<X>, ExMessages<X>, ExCtx<X>>
	): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return this.#props.lazy().exec(args)
	}
}

export const lazy = <X extends XisAsyncBase>(lazy: () => X): XisLazyAsync<X> =>
	new XisLazyAsync({ lazy })
