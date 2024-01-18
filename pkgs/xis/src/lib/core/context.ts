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

export interface XisCtx {
	[prop: TruePropertyKey]:
		| XisBasic
		| XisCtx
		| Array<XisCtx>
		| Promise<XisBasic>
		| Promise<XisCtx | Array<XisCtx>>
		| ((
				...args: Array<any>
		  ) => XisBasic | XisCtx | Array<XisCtx> | Promise<XisBasic | XisCtx | Array<XisCtx>>)
}

export type XisCtxBase = XisCtx | undefined

export type XisBuildCtx<Current extends XisCtxBase, Next extends XisCtxBase> = [
	Current,
] extends [undefined]
	? Next
	: [Next] extends [undefined]
		? Current
		: Current & Next

export interface XisArg<In, Ctx extends XisCtxBase> {
	value: In
	path: XisPath
	ctx: Ctx
}

export type XisArgBase = XisArg<any, XisCtxBase>

export const addElement = <In, Ctx extends XisCtxBase>(
	ctx: XisArg<In, Ctx>,
	elem: PathElement
): XisArg<In, Ctx> => {
	const { segment, side } = elem
	return {
		...ctx,
		path: [
			...ctx.path,
			{
				segment,
				side,
			},
		],
	}
}
