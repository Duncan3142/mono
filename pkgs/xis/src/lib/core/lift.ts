import type { ExIn, ExIssues, ExOut, ExArg, ExCtx, ExMessages } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisSyncBase } from "./sync.js"

export interface XisLiftProps<X extends XisSyncBase> {
	inner: X
}

export type XisLiftPropsBase = XisLiftProps<XisSyncBase>

export class XisLift<X extends XisSyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	ExMessages<X>,
	ExCtx<ExIn<X>>
> {
	#props: XisLiftProps<X>
	get inner(): X {
		return this.#props.inner
	}
	constructor(props: XisLiftProps<X>) {
		super()
		this.#props = props
	}
	exec(args: ExArg<X>): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return Promise.resolve(this.inner.exec(args))
	}
}

export const lift = <X extends XisSyncBase>(inner: X): XisLift<X> => new XisLift({ inner })
