import type { XisExecArgs } from "#core/args.js"

import type { ExIn, ExIssues, ExOut, ExCtx } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync, type XisAsyncBase } from "#core/async.js"

interface XisLazyAsyncProps<X extends XisAsyncBase> {
	lazy: () => X
}

export class XisLazyAsync<X extends XisAsyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExCtx<X>
> {
	#props: XisLazyAsyncProps<X>

	constructor(props: XisLazyAsyncProps<X>) {
		super()
		this.#props = props
	}

	exec(args: XisExecArgs<ExIn<X>, ExCtx<X>>): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return this.#props.lazy().exec(args)
	}
}

export const lazy = <X extends XisAsyncBase>(lazy: () => X): XisLazyAsync<X> =>
	new XisLazyAsync({ lazy })
