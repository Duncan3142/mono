import type { ObjArgBase } from "#util/arg.js"
import type { PathElement, XisPath } from "./path.js"

export interface XisExecArgs<In, Ctx extends ObjArgBase> {
	value: In
	path: XisPath
	ctx: Ctx
}

export type XisExecArgsBase = XisExecArgs<unknown, ObjArgBase>

export const addElement = <In, Ctx extends ObjArgBase>(
	args: XisExecArgs<In, Ctx>,
	elem: PathElement
): XisExecArgs<In, Ctx> => {
	const { segment, side } = elem
	return {
		...args,
		path: [
			...args.path,
			{
				segment,
				side,
			},
		],
	}
}
