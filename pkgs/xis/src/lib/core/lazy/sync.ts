import type { XisExecArgs } from "#core/args.js"

import type { ExIn, ExIssues, ExOut, ExCtx } from "#core/kernel.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"

interface XisLazySyncProps<X extends XisSyncBase> {
	lazy: () => X
}

interface XisLazySyncArgs<X extends XisSyncBase> {
	props: XisLazySyncProps<X>
}

export class XisLazySync<X extends XisSyncBase> extends XisSync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExCtx<X>
> {
	#props: XisLazySyncProps<X>

	constructor(args: XisLazySyncArgs<X>) {
		super()
		this.#props = args.props
	}

	exec(args: XisExecArgs<ExIn<X>, ExCtx<X>>): ExecResultSync<ExIssues<X>, ExOut<X>> {
		return this.#props.lazy().exec(args)
	}
}

export const lazy = <X extends XisSyncBase>(lazy: () => X): XisLazySync<X> =>
	new XisLazySync({ props: { lazy } })
