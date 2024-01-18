import type { ExIn, ExIssues, ExOut, ExArg, ExCtx } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisSyncBase } from "./sync.js"
import type { XisProps } from "./prop.js"

export interface XisLiftProps<X extends XisSyncBase> extends XisProps<X["nullable"]> {
	inner: X
}

export class XisLift<X extends XisSyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	XisLiftProps<X>,
	ExCtx<X>
> {
	get inner(): XisLiftProps<X>["inner"] {
		return this.props.inner
	}
	exec(args: ExArg<X>): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return Promise.resolve(this.inner.exec(args))
	}
}

export const lift = <X extends XisSyncBase>(inner: X): XisLift<X> => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const props: XisLiftProps<X> = { ...inner.props, inner }
	return new XisLift(props)
}
