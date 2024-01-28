import type { XisIssueBase } from "#core/error.js"

import type { ExecResultSync, ExecResultSyncBase, XisSync } from "./sync.js"
import type { ExecResultAsync, XisAsync } from "./async.js"
import { Left } from "purify-ts/Either"
import type { BuildObjArg, ObjArgBase } from "#util/arg.js"
import type { XisExecArgs } from "./args.js"
import { Effect } from "./book-keeping.js"

export type ExecResult<Issues extends XisIssueBase, Out> =
	| ExecResultSync<Issues, Out>
	| ExecResultAsync<Issues, Out>
export type ExecResultBase = ExecResult<XisIssueBase, unknown>

export type ExExecResultIssues<R extends ExecResultBase> =
	R extends ExecResult<infer Issues, any> ? Issues : never

export type ExExecResultOut<R extends ExecResultBase> =
	R extends ExecResult<any, infer Out> ? Out : never

export type Xis<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Eff extends Effect = typeof Effect.Validate,
	Ctx extends ObjArgBase = ObjArgBase,
> = XisSync<In, Issues, Out, Eff, Ctx> | XisAsync<In, Issues, Out, Eff, Ctx>

export type XisBase = Xis<any, XisIssueBase, unknown, Effect, any>

export type ExIn<T extends XisBase> = T["types"]["i"]

export type ExIssues<T extends XisBase> = T["types"]["is"]

export type ExOut<T extends XisBase> = T["types"]["o"]

export type ExEff<T extends XisBase> = T["effect"]

export type ExCtx<T extends XisBase> = T["types"]["c"]

export type ExArgs<T extends XisBase> = XisExecArgs<ExIn<T>, ExCtx<T>>

export const mergeIssues = <R extends ExecResultSyncBase>(
	acc: R,
	issues: Array<ExExecResultIssues<R>>
): R =>
	acc.caseOf({
		Left: (accIssues) => Left([...accIssues, ...issues]),
		Right: (_) => Left(issues),
	}) as R

export type XisListIssues<
	List extends [...Array<XisBase>],
	Acc extends XisIssueBase = never,
> = List extends [infer Head extends XisBase, ...infer Tail extends Array<XisBase>]
	? XisListIssues<Tail, Acc | ExIssues<Head>>
	: Acc

export type XisListEffect<
	List extends [...Array<XisBase>],
	Acc extends Effect = typeof Effect.Validate,
> = List extends [infer Head extends XisBase, ...infer Tail extends Array<XisBase>]
	? XisListEffect<
			Tail,
			[ExEff<Head>] extends [typeof Effect.Transform] ? typeof Effect.Transform : Acc
		>
	: Acc

export type XisListCtx<
	List extends [...Array<XisBase>],
	Acc extends ObjArgBase = ObjArgBase,
> = List extends [infer Next extends XisBase, ...infer Rest extends Array<XisBase>]
	? XisListCtx<Rest, BuildObjArg<Acc, ExCtx<Next>>>
	: Acc

export const xisListEffect = <List extends [...Array<XisBase>]>(
	list: [...List]
): XisListEffect<List> =>
	list.reduce<Effect>(
		(acc, x) => (acc === Effect.Transform ? acc : x.effect),
		Effect.Validate
	) as XisListEffect<List>
