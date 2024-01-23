import type { ObjArgBase } from "#util/arg.js"
import type { ExIssueName, XisIssueBase } from "./error.js"
import type { XisPath } from "./path.js"

export type XisMessageBuilderArgs<In, Ctx extends ObjArgBase, Props extends ObjArgBase> = {
	value: In
	path: XisPath
	ctx: Ctx
	props: Props
}

export type XisMessageBuilder<In, Ctx extends ObjArgBase, Props extends ObjArgBase> = (
	args: XisMessageBuilderArgs<In, Ctx, Props>
) => string

export type XisMessageBuilderAsync<In, Ctx extends ObjArgBase, Props extends ObjArgBase> = (
	args: XisMessageBuilderArgs<In, Ctx, Props>
) => Promise<string>

export type XisMessageBuilderBase =
	| XisMessageBuilder<unknown, ObjArgBase, ObjArgBase>
	| XisMessageBuilderAsync<unknown, ObjArgBase, ObjArgBase>

export type XisMessages<Issues extends XisIssueBase> =
	| {
			[N in ExIssueName<Issues>]?: XisMessageBuilderBase
	  }
	| null

export type XisMessagesBase = XisMessages<XisIssueBase>
