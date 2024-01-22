import type { ExIssueName, XisIssueBase } from "./error.js"

export type XisMessageBuilder = (...args: Array<any>) => string

export type XisMessages<Issues extends XisIssueBase> =
	| {
			[N in ExIssueName<Issues>]?: string | XisMessageBuilder
	  }
	| null

export type XisMessagesBase = XisMessages<XisIssueBase>

export type XisBuildMessages<Current extends XisMessagesBase, Next extends XisMessagesBase> = [
	Current,
] extends [null]
	? Next
	: [Next] extends [null]
		? Current
		: Current & Next

// export interface XisProps<Issues extends XisIssueBase> {
// 	messages: XisMessages<Issues>
// }

// export type XisPropsBase = XisProps<XisIssueBase>
