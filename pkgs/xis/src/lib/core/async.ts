import type { XisExecArgs } from "#core/args.js"
import type { XisIssueBase } from "#core/error.js"
import type { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync } from "./sync.js"
import { BookkeepingError, Effect, type XisBookKeeping } from "./book-keeping.js"
import type { ObjArgBase } from "#util/arg.js"

export type ExecEitherAsync<Issues extends XisIssueBase, Out> = EitherAsync<Array<Issues>, Out>
export type ExecResultAsync<Issues extends XisIssueBase, Out> = Promise<
	ExecResultSync<Issues, Out>
>
export type ExecResultAsyncBase = ExecResultAsync<XisIssueBase, unknown>

const ASYNC = "ASYNC"

export abstract class XisAsync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Eff extends Effect = typeof Effect.Validate,
	Ctx extends ObjArgBase = ObjArgBase,
> {
	get concurrency(): typeof ASYNC {
		return ASYNC
	}
	abstract get effect(): Eff
	abstract exec(args: XisExecArgs<In, Ctx>): ExecResultAsync<Issues, Out>
	get types(): XisBookKeeping<In, Issues, Out, Ctx> {
		throw new BookkeepingError()
	}
}

export type XisAsyncBase = XisAsync<any, XisIssueBase, unknown, Effect, any>
