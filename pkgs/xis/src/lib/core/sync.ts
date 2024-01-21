import type { XisArg, XisCtxBase } from "#core/context.js"
import type { Either } from "purify-ts/Either"
import type { XisIssueBase } from "#core/error.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisMessages } from "./prop.js"

export type ExecResultSync<Issues extends XisIssueBase, Out> = Either<Array<Issues>, Out>
export type ExecResultSyncBase = ExecResultSync<XisIssueBase, unknown>

export type XisSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = null,
> = (args: XisArg<In, Ctx>) => ExecResultSync<Issues, Out>

const SYNC = "SYNC"

export abstract class XisSync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Messages extends XisMessages<Issues> = XisMessages<Issues>,
	Ctx extends XisCtxBase = null,
> {
	get mode(): typeof SYNC {
		return SYNC
	}
	abstract get messages(): Messages
	abstract exec(args: XisArg<In, Ctx>): ExecResultSync<Issues, Out>
	get types(): XisBookKeeping<In, Issues, Out, Ctx> {
		throw new BookkeepingError()
	}
}

export type XisSyncBase = XisSync<any, XisIssueBase, unknown, XisMessages<XisIssueBase>, any>
