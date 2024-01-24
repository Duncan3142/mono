import type { ObjArgBase } from "#util/arg.js"
import type { XisPath } from "./path.js"

export interface XisExecArgs<In = unknown, Ctx extends ObjArgBase = null> {
	value: In
	path: XisPath
	ctx: Ctx
}
