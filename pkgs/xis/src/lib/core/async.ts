import type { XisArg, XisCtxBase } from "#core/context.js"
import type { XisIssueBase } from "#core/error.js"
import type { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync } from "./sync.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisMessages } from "./prop.js"

export type ExecEitherAsync<Issues extends XisIssueBase, Out> = EitherAsync<Array<Issues>, Out>
export type ExecResultAsync<Issues extends XisIssueBase, Out> = Promise<
	ExecResultSync<Issues, Out>
>
export type ExecResultAsyncBase = ExecResultAsync<XisIssueBase, unknown>

export type XisAsyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = null,
> = (args: XisArg<In, Ctx>) => ExecResultAsync<Issues, Out>

const ASYNC = "ASYNC"

export abstract class XisAsync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Messages extends XisMessages<Issues> = XisMessages<Issues>,
	Ctx extends XisCtxBase = null,
> {
	get mode(): typeof ASYNC {
		return ASYNC
	}
	abstract get messages(): Messages
	abstract exec(args: XisArg<In, Ctx>): ExecResultAsync<Issues, Out>
	get types(): XisBookKeeping<In, Issues, Out, Ctx> {
		throw new BookkeepingError()
	}
}

export type XisAsyncBase = XisAsync<any, XisIssueBase, unknown, XisMessages<XisIssueBase>, any>
