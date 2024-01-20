import type { TruePropertyKey } from "#util/base-type.js"

export const CheckSide = {
	Key: "KEY",
	Value: "VALUE",
} as const

export type CheckSide = (typeof CheckSide)[keyof typeof CheckSide]

export type PathSegment = string | symbol | number

export interface PathElement {
	segment: PathSegment
	side: CheckSide
}

export type XisPath = ReadonlyArray<PathElement>

export type XisPathSegments = ReadonlyArray<PathSegment>

type XisBasic = string | number | boolean | undefined | symbol | object | null | Array<XisBasic>

export interface XisCtxObj {
	[prop: TruePropertyKey]:
		| XisBasic
		| XisCtxObj
		| Array<XisCtxObj>
		| Promise<XisBasic>
		| Promise<XisCtxObj | Array<XisCtxObj>>
		| ((
				...args: Array<any>
		  ) =>
				| XisBasic
				| XisCtxObj
				| Array<XisCtxObj>
				| Promise<XisBasic | XisCtxObj | Array<XisCtxObj>>)
}

export type XisCtxBase = XisCtxObj | null

export type XisBuildCtx<Current extends XisCtxBase, Next extends XisCtxBase> = [
	Current,
] extends [null]
	? Next
	: [Next] extends [null]
		? Current
		: Current & Next

export interface XisArg<In, Ctx extends XisCtxBase> {
	value: In
	path: XisPath
	ctx: Ctx
}

export type XisArgBase = XisArg<any, XisCtxBase>

export const addElement = <In, Ctx extends XisCtxBase>(
	args: XisArg<In, Ctx>,
	elem: PathElement
): XisArg<In, Ctx> => {
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
