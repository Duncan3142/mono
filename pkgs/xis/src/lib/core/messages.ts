import type { ObjArgBase } from "#util/arg.js"
import type { Locale } from "./args.js"
import type { ExIssueName, XisIssueBase } from "./error.js"
import type { XisPath } from "./path.js"

export type XisMsgArgs<Input = unknown, Ctx extends ObjArgBase = ObjArgBase> = {
	locale: Locale
	input: Input
	path: XisPath
	ctx: Ctx
}

export type XisMsgBuilder<Input = unknown, Ctx extends ObjArgBase = ObjArgBase> = (
	args: XisMsgArgs<Input, Ctx>
) => string

export type XisMsgBuilderAsync<Input = unknown, Ctx extends ObjArgBase = ObjArgBase> = (
	args: XisMsgArgs<Input, Ctx>
) => Promise<string>

export type XisMsgBuilderBase = XisMsgBuilder<any, any> | XisMsgBuilderAsync<any, any>

export type XisMessages<Issues extends XisIssueBase> = {
	[N in ExIssueName<Issues>]: XisMsgBuilderBase
}

export type XisMessagesBase = XisMessages<XisIssueBase> | null
