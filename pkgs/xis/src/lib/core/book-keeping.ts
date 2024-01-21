import type { XisCtxBase } from "./context.js"
import type { XisIssueBase } from "./error.js"
import type { XisMessages } from "./prop.js"

export interface XisBookKeeping<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Messages extends XisMessages<Issues> = XisMessages<Issues>,
	Ctx extends XisCtxBase = null,
> {
	i: In
	is: Issues
	o: Out
	c: Ctx
	m: Messages
}

export class BookkeepingError extends Error {
	override name = "BookkeepingError" as const
	constructor() {
		super("Do not access this property, it is bookkeeping for the type-system")
	}
}
