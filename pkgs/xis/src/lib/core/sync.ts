import type { XisArgs, XisCtxBase } from "#core/context.js"
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
	Messages extends XisMessages<Issues> = null,
	Ctx extends XisCtxBase = null,
> = (args: XisArgs<In, Messages, Ctx>) => ExecResultSync<Issues, Out>

const SYNC = "SYNC"

export abstract class XisSync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Messages extends XisMessages<Issues> = null,
	Ctx extends XisCtxBase = null,
> {
	get mode(): typeof SYNC {
		return SYNC
	}
	abstract exec(args: XisArgs<In, Messages, Ctx>): ExecResultSync<Issues, Out>
	get types(): XisBookKeeping<In, Issues, Out, Messages, Ctx> {
		throw new BookkeepingError()
	}
}

export type XisSyncBase = XisSync<any, XisIssueBase, unknown, any, any>
