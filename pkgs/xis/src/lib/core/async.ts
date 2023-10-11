import type { XisCtx, XisOptArgs } from "#core/context.js"
import type { XisIssueBase } from "#core/error.js"
import type { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync, ParseResultSync } from "./sync.js"
import { XisBookKeeping } from "./book-keeping.js"

export type ExecEitherAsync<Issues extends XisIssueBase, Out> = EitherAsync<Array<Issues>, Out>

export type ExecResultAsync<Issues extends XisIssueBase, Out> = Promise<
	ExecResultSync<Issues, Out>
>
export type ExecResultAsyncBase = ExecResultAsync<XisIssueBase, unknown>

export type XisAsyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Args extends XisOptArgs = undefined,
> = (value: In, ctx: XisCtx<Args>) => ExecResultAsync<Issues, Out>

export type ParseResultAsync<
	GuardIssues extends XisIssueBase,
	ExecIssues extends XisIssueBase,
	Out,
> = Promise<ParseResultSync<GuardIssues, ExecIssues, Out>>
export type ParseResultAsyncBase = ParseResultAsync<XisIssueBase, XisIssueBase, unknown>

export abstract class XisAsync<
	In,
	GuardIssues extends XisIssueBase = never,
	ExecIssues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> extends XisBookKeeping<In, GuardIssues, ExecIssues, Out, Args> {
	abstract exec(value: In, ctx: XisCtx<Args>): ExecResultAsync<ExecIssues, Out>
	abstract parse(
		value: unknown,
		ctx: XisCtx<Args>
	): ParseResultAsync<GuardIssues, ExecIssues, Out>
}

export type XisAsyncBase = XisAsync<any, XisIssueBase, XisIssueBase, unknown, any>
