import type { ExIn, ExIssues, ExOut, ExArg, ExCtx } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import type { XisSync, XisSyncBase } from "./sync.js"
import type { XisProps } from "./prop.js"

export interface XisLiftProps<X extends XisSyncBase> extends XisProps<X["props"]["messages"]> {
	inner: X
}

export type XisLiftPropsBase = XisLiftProps<XisSyncBase>

export class XisLift<P extends XisLiftPropsBase> extends XisAsync<
	ExIn<P["inner"]>,
	ExIssues<P["inner"]>,
	ExOut<ExIn<P["inner"]>>,
	P,
	ExCtx<ExIn<P["inner"]>>
> {
	override get messages(): P["inner"]["messages"] {
		return this.inner.messages
	}
	get inner(): P["inner"] {
		return this.props.inner
	}
	exec(args: ExArg<P["inner"]>): ExecResultAsync<ExIssues<P["inner"]>, ExOut<P["inner"]>> {
		return Promise.resolve(this.inner.exec(args))
	}
}

export const lift = <X extends XisSyncBase>(inner: X): XisLift<XisLiftProps<X>> =>
	new XisLift({ inner })

type XT = XisSync<
	number,
	{ name: "BAD"; path: [] },
	string,
	{ messages: { HELLO: string } },
	{ now: Date }
>

let inner!: XT

inner.messages

const x = lift(inner)

x.messages
