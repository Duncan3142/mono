import type { ObjArgBase } from "#util/arg.js"
import type { ExIssueName, XisIssueBase } from "./error.js"
import type { XisPath } from "./path.js"

export type XisMsgArgs<
	In = unknown,
	Ctx extends ObjArgBase = null,
	Props extends ObjArgBase = null,
> = {
	value: In
	path: XisPath
	ctx: Ctx
	props: Props
}

export type XisMsgBuilder<
	In = unknown,
	Ctx extends ObjArgBase = null,
	Props extends ObjArgBase = null,
> = (args: XisMsgArgs<In, Ctx, Props>) => string

export type XisMsgBuilderAsync<
	In = unknown,
	Ctx extends ObjArgBase = null,
	Props extends ObjArgBase = null,
> = (args: XisMsgArgs<In, Ctx, Props>) => Promise<string>

export type XisMsgBuilderBase = XisMsgBuilder<any, any, any> | XisMsgBuilderAsync<any, any, any>

export type XisMessages<Issues extends XisIssueBase> = {
	[N in ExIssueName<Issues>]: XisMsgBuilderBase
}

export type XisMessagesBase = XisMessages<XisIssueBase> | null
