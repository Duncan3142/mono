import type { ExIssueName, XisIssueBase } from "./error.js"

export type MessageBuilder = (...args: Array<any>) => string

export type Messages<IssueNames extends string> = {
	[N in IssueNames]?: string | MessageBuilder
}

// export type BaseMessages = Messages<string>

export interface XisProps<Issues extends XisIssueBase> {
	messages: Messages<ExIssueName<Issues>> | null
}

// export type XisPropsBase = XisProps<XisIssueBase>
