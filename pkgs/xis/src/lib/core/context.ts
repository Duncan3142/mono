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

export interface XisArgs {
	[prop: TruePropertyKey]:
		| XisBasic
		| XisArgs
		| Array<XisArgs>
		| Promise<XisBasic>
		| Promise<XisArgs | Array<XisArgs>>
		| ((
				...args: Array<any>
		  ) => XisBasic | XisArgs | Array<XisArgs> | Promise<XisBasic | XisArgs | Array<XisArgs>>)
}

export type XisOptArgs = undefined | XisArgs

export type XisBuildArgs<
	Current extends XisOptArgs,
	Next extends XisOptArgs,
> = Current extends undefined ? Next : Next extends undefined ? Current : Current & Next

export interface XisCtx<XisArgs extends XisOptArgs> {
	path: XisPath
	args: XisArgs
}

export type XisCtxBase = XisCtx<XisOptArgs>

export const addElement = <Args extends XisOptArgs>(
	ctx: XisCtx<Args>,
	elem: PathElement
): XisCtx<Args> => {
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
