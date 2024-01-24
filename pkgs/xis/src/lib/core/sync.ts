import type { XisExecArgs } from "#core/args.js"
import type { Either } from "purify-ts/Either"
import type { XisIssueBase } from "#core/error.js"
import { BookkeepingError, Effect, type XisBookKeeping } from "./book-keeping.js"
import type { ObjArgBase } from "#util/arg.js"

export type ExecResultSync<Issues extends XisIssueBase, Out> = Either<Array<Issues>, Out>
export type ExecResultSyncBase = ExecResultSync<XisIssueBase, unknown>

export type XisSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends ObjArgBase = null,
> = (args: XisExecArgs<In, Ctx>) => ExecResultSync<Issues, Out>

const SYNC = "SYNC"

export abstract class XisSync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Ctx extends ObjArgBase = null,
> {
	get concurrency(): typeof SYNC {
		return SYNC
	}
	abstract get effect(): Effect
	abstract exec(args: XisExecArgs<In, Ctx>): ExecResultSync<Issues, Out>
	get types(): XisBookKeeping<In, Issues, Out, Ctx> {
		throw new BookkeepingError()
	}
}

export type XisSyncBase = XisSync<any, XisIssueBase, unknown, any>
