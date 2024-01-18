import type { XisCtxBase } from "./context.js"
import type { XisIssueBase } from "./error.js"

export interface XisBookKeeping<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Ctx extends XisCtxBase = undefined,
> {
	i: In
	is: Issues
	o: Out
	c: Ctx
}

export class BookkeepingError extends Error {
	override name = "BookkeepingError" as const
	constructor() {
		super("Do not access this property, it is bookkeeping for the type-system")
	}
}
