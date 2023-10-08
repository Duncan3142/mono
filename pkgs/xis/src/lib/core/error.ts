import type { XisPath } from "./path.js"

export interface XisIssue<Name extends string> {
	name: Name
	message: string
	path: XisPath
}

export type XisIssueBase = XisIssue<string>

export type ExIssueName<Issue extends XisIssueBase> = Issue["name"]

export class XisError<Issue extends XisIssueBase> extends Error {
	override name = "XIS_ERROR" as const
	#issues: Array<Issue>
	constructor(issues: Array<Issue>) {
		super()
		this.#issues = issues
	}

	get issues(): Array<Issue> {
		return this.#issues
	}
}
