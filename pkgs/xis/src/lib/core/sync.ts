import type { XisCtx, XisOptArgs } from "#core/context.js"
import type { Either } from "purify-ts/Either"
import type { XisIssueBase } from "#core/error.js"
import { XisBookKeeping } from "./book-keeping.js"

export type ExecResultSync<Issues extends XisIssueBase, Out> = Either<Array<Issues>, Out>
export type ExecResultSyncBase = ExecResultSync<XisIssueBase, unknown>

export type XisSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Args extends XisOptArgs = undefined,
> = (value: In, ctx: XisCtx<Args>) => ExecResultSync<Issues, Out>

export type ParseResultSync<
	GuardIssues extends XisIssueBase,
	ExecIssues extends XisIssueBase,
	Out,
> = ExecResultSync<GuardIssues | ExecIssues, Out>
export type ParseResultSyncBase = ParseResultSync<XisIssueBase, XisIssueBase, unknown>

export abstract class XisSync<
	In,
	GuardIssues extends XisIssueBase = never,
	ExecIssues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> extends XisBookKeeping<In, GuardIssues, ExecIssues, Out, Args> {
	abstract exec(value: In, ctx: XisCtx<Args>): ExecResultSync<ExecIssues, Out>
	abstract parse(
		value: unknown,
		ctx: XisCtx<Args>
	): ParseResultSync<GuardIssues, ExecIssues, Out>
}

export type XisSyncBase = XisSync<any, XisIssueBase, XisIssueBase, unknown, any>
