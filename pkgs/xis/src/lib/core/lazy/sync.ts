import type { XisArg } from "#core/context.js"

import type { ExIn, ExIssues, ExOut, ExMessages, ExCtx } from "#core/kernel.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"

interface XisLazySyncProps<X extends XisSyncBase> {
	lazy: () => X
}

export class XisLazySync<X extends XisSyncBase> extends XisSync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExMessages<X>,
	ExCtx<X>
> {
	#props: XisLazySyncProps<X>

	constructor(props: XisLazySyncProps<X>) {
		super()
		this.#props = props
	}

	exec(args: XisArg<ExIn<X>, ExMessages<X>, ExCtx<X>>): ExecResultSync<ExIssues<X>, ExOut<X>> {
		return this.#props.lazy().exec(args)
	}
}

export const lazy = <X extends XisSyncBase>(lazy: () => X): XisLazySync<X> =>
	new XisLazySync({ lazy })
