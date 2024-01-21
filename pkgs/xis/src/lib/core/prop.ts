import type { ExIssueName, XisIssueBase } from "./error.js"

export type XisMessageBuilder = (...args: Array<any>) => string

export type XisMessages<Issues extends XisIssueBase> =
	| {
			[N in ExIssueName<Issues>]?: string | XisMessageBuilder
	  }
	| null

export type XisMessagesBase = XisMessages<XisIssueBase>

// export interface XisProps<Issues extends XisIssueBase> {
// 	messages: XisMessages<Issues>
// }

// export type XisPropsBase = XisProps<XisIssueBase>
