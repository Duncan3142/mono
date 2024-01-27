import type { XisExecArgs } from "#core/args.js"
import type { ExecResultAsync } from "#core/async.js"
import type { XisIssueBase } from "#core/error.js"
import type { ExecResultSync } from "#core/sync.js"
import type { ObjArgBase } from "#util/arg.js"

export type XisTransformSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends ObjArgBase = null,
> = (args: XisExecArgs<In, Ctx>) => ExecResultSync<Issues, Out>

export type XisTransformAsyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends ObjArgBase = null,
> = (args: XisExecArgs<In, Ctx>) => ExecResultAsync<Issues, Out>

export type XisTransformFn<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Ctx extends ObjArgBase = null,
> = XisTransformSyncFn<In, Issues, Out, Ctx> | XisTransformAsyncFn<In, Issues, Out, Ctx>
