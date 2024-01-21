import type { ExIn, ExIssues, ExOut, ExArg, ExCtx } from "#core/kernel.js"
import { XisAsync, type ExecResultAsync } from "#core/async.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "./sync.js"
import type { XisProps } from "./prop.js"
import type { XisArg } from "./context.js"
import type { XisIssue } from "./error.js"
import { Right } from "purify-ts"

export interface XisLiftProps<X extends XisSyncBase> extends XisProps<ExIssues<X>> {
	inner: X
	messages: X["messages"]
}

export type XisLiftPropsBase = XisLiftProps<XisSyncBase>

export class XisLift<X extends XisSyncBase> extends XisAsync<
	ExIn<X>,
	ExIssues<X>,
	ExOut<X>,
	XisLiftProps<X>,
	ExCtx<ExIn<X>>
> {
	get inner(): X {
		return this.props.inner
	}
	exec(args: ExArg<X>): ExecResultAsync<ExIssues<X>, ExOut<X>> {
		return Promise.resolve(this.inner.exec(args))
	}
}

export const lift = <X extends XisSyncBase>(inner: X): XisLift<X> =>
	new XisLift({ inner, messages: inner.messages })

/* ---------------------------------- TEST ---------------------------------- */

// type XTIssues = XisIssue<"BAD">

// type XTCtx = { now: Date }

// export class XT extends XisSync<number, XTIssues, string, XisProps<XTIssues>, XTCtx> {
// 	override exec(args: XisArg<number, XTCtx>): ExecResultSync<XTIssues, string> {
// 		return Right(`Hello ${args.ctx.now.toISOString()}`)
// 	}
// }

// let inner!: XT

// inner.messages

// const x = lift(inner)

// x.messages

// export const a = x.exec({
// 	value: 1,
// 	path: [],
// 	ctx: {
// 		now: new Date(),
// 	},
// })
