import type { XisExecArgs } from "#core/args.js"
import type { ExIn, ExIssues, ExOut, ExCtx, ExEff } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync, type XisAsyncBase } from "#core/async.js"

interface XisLazyAsyncProps<X extends XisAsyncBase> {
	lazy: () => X
}

interface XisLazyAsyncArgs<X extends XisAsyncBase> {
	props: XisLazyAsyncProps<X>
}

export class XisLazyAsync<X extends XisAsyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExEff<X>,
	ExCtx<X>
> {
	#props: XisLazyAsyncProps<X>

	constructor(args: XisLazyAsyncArgs<X>) {
		super()
		this.#props = args.props
	}

	override get effect(): ExEff<X> {
		return this.#props.lazy().effect
	}

	exec(args: XisExecArgs<ExIn<X>, ExCtx<X>>): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return this.#props.lazy().exec(args)
	}
}

export const lazy = <X extends XisAsyncBase>(lazy: () => X): XisLazyAsync<X> =>
	new XisLazyAsync({ props: { lazy } })
