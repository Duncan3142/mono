import { type XisCtx, type XisOptArgs } from "#core/context.js"

import type { XisIssueBase } from "#core/error.js"

import type { ExecResultSync, ExecResultSyncBase, XisSync, XisSyncFn } from "./sync.js"
import type { ExecResultAsync, XisAsync, XisAsyncFn } from "./async.js"
import { neverGuard } from "#util/never-guard.js"
import { Left } from "purify-ts/Either"

export type ExecResult<Issues extends XisIssueBase, Out> =
	| ExecResultSync<Issues, Out>
	| ExecResultAsync<Issues, Out>

export type ExecResultBase = ExecResult<XisIssueBase, unknown>

export type ExExecResultIssues<R extends ExecResultBase> =
	R extends ExecResult<infer Issues, any> ? Issues : never

export type ExExecResultOut<R extends ExecResultBase> =
	R extends ExecResult<any, infer Out> ? Out : never

export type XisFn<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> = XisSyncFn<In, Issues, Out, Args> | XisAsyncFn<In, Issues, Out, Args>

export type Xis<
	In,
	GuardIssues extends XisIssueBase = never,
	ExecIssues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> =
	| XisSync<In, GuardIssues, ExecIssues, Out, Args>
	| XisAsync<In, GuardIssues, ExecIssues, Out, Args>

export type XisBase = Xis<any, XisIssueBase, XisIssueBase, unknown, any>

export type ExIn<T extends XisBase> = T["_bk"]["i"]

export type ExGuardIssues<T extends XisBase> = T["_bk"]["gi"]

export type ExExecIssues<T extends XisBase> = T["_bk"]["ei"]

export type ExOut<T extends XisBase> = T["_bk"]["o"]

export type ExArgs<T extends XisBase> = T["_bk"]["a"]

export type ExCtx<T extends XisBase> = XisCtx<ExArgs<T>>

export const InvokeMode = {
	parse: "parse",
	exec: "exec",
} as const

export type InvokeMode = (typeof InvokeMode)[keyof typeof InvokeMode]

export type ExInvoke<T extends XisBase, Mode extends InvokeMode> = ReturnType<T[Mode]>

export const invoke = <Mode extends InvokeMode, X extends XisBase>(
	mode: Mode,
	xis: X,
	value: ExIn<X>,
	ctx: ExCtx<X>
): ExInvoke<X, Mode> => {
	type Res = ExInvoke<X, Mode>
	switch (mode) {
		case InvokeMode.parse:
			return xis.parse(value, ctx) as Res
		case InvokeMode.exec:
			return xis.exec(value, ctx) as Res
		default:
			return neverGuard(mode)
	}
}

export const mergeIssues = <R extends ExecResultSyncBase>(
	acc: R,
	issues: Array<ExExecResultIssues<R>>
): R =>
	acc.caseOf({
		Left: (accIssues) => Left([...accIssues, ...issues]),
		Right: (_) => Left(issues),
	}) as R

export const xt = <T extends Array<XisBase>>(...args: T): T => args
