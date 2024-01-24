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

export const addElement = (path: XisPath, elem: PathElement): XisPath => {
	const { segment, side } = elem
	return [
		...path,
		{
			segment,
			side,
		},
	]
}
