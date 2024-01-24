import type { ObjArgBase } from "#util/arg.js"
import type { ExIssueName, XisIssueBase } from "./error.js"
import type { XisPath } from "./path.js"

export type XisMsgArgs<
	In = unknown,
	Props extends ObjArgBase = null,
	Ctx extends ObjArgBase = null,
> = {
	value: In
	path: XisPath
	locale: string
	props: Props
	ctx: Ctx
}

export type XisMsgBuilder<
	In = unknown,
	Props extends ObjArgBase = null,
	Ctx extends ObjArgBase = null,
> = (args: XisMsgArgs<In, Props, Ctx>) => string

export type XisMsgBuilderAsync<
	In = unknown,
	Props extends ObjArgBase = null,
	Ctx extends ObjArgBase = null,
> = (args: XisMsgArgs<In, Props, Ctx>) => Promise<string>

export type XisMsgBuilderBase = XisMsgBuilder<any, any, any> | XisMsgBuilderAsync<any, any, any>

export type XisMessages<Issues extends XisIssueBase> = {
	[N in ExIssueName<Issues>]: XisMsgBuilderBase
}

export type XisMessagesBase = XisMessages<XisIssueBase> | null
