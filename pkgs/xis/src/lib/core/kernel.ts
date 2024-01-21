import type { XisCtxBase, XisArg } from "#core/context.js"

import type { XisIssueBase } from "#core/error.js"

import type { ExecResultSync, ExecResultSyncBase, XisSync, XisSyncFn } from "./sync.js"
import type { ExecResultAsync, XisAsync, XisAsyncFn } from "./async.js"
import { Left } from "purify-ts/Either"
import type { XisMessages } from "./prop.js"

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
	Ctx extends XisCtxBase = null,
> = XisSyncFn<In, Issues, Out, Ctx> | XisAsyncFn<In, Issues, Out, Ctx>

export type Xis<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Messages extends XisMessages<Issues> = XisMessages<Issues>,
	Ctx extends XisCtxBase = null,
> = XisSync<In, Issues, Out, Messages, Ctx> | XisAsync<In, Issues, Out, Messages, Ctx>

export type XisBase = Xis<any, XisIssueBase, unknown, XisMessages<XisIssueBase>, any>

export type ExIn<T extends XisBase> = T["types"]["i"]

export type ExIssues<T extends XisBase> = T["types"]["is"]

export type ExOut<T extends XisBase> = T["types"]["o"]

export type ExCtx<T extends XisBase> = T["types"]["c"]

export type ExArg<T extends XisBase> = XisArg<ExIn<T>, ExCtx<T>>

export const mergeIssues = <R extends ExecResultSyncBase>(
	acc: R,
	issues: Array<ExExecResultIssues<R>>
): R =>
	acc.caseOf({
		Left: (accIssues) => Left([...accIssues, ...issues]),
		Right: (_) => Left(issues),
	}) as R

export const xt = <T extends Array<XisBase>>(...args: T): T => args
