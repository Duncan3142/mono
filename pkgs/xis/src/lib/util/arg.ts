import type { TruePropertyKey } from "./base-type.js"

export type ObjArg = Record<TruePropertyKey, unknown>

export type ObjArgBase = ObjArg | null

export type BuildObjArg<Current extends ObjArgBase, Next extends ObjArgBase> = [
	Current,
] extends [null]
	? Next
	: [Next] extends [null]
		? Current
		: Current & Next
