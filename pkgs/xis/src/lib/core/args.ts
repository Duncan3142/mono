import type { ObjArgBase } from "#util/arg.js"
import type { XisPath } from "./path.js"

export type Locale = string | null

export interface XisExecArgs<In = unknown, Ctx extends ObjArgBase = ObjArgBase> {
	value: In
	path: XisPath
	locale: Locale
	ctx: Ctx
}
