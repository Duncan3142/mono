import type { ObjArgBase } from "#util/arg.js"
import type { XisIssueBase } from "./error.js"

export interface XisBookKeeping<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Ctx extends ObjArgBase = null,
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

export const Effect = {
	Transform: "Transform",
	Validate: "Validate",
} as const

export type Effect = (typeof Effect)[keyof typeof Effect]
