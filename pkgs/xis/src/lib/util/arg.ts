import type { TruePropertyKey } from "./base-type.js"

type BasicArg = string | number | boolean | undefined | symbol | object | null | Array<BasicArg>

export interface ObjArg {
	[prop: TruePropertyKey]:
		| BasicArg
		| ObjArg
		| Array<ObjArg>
		| Promise<BasicArg>
		| Promise<ObjArg | Array<ObjArg>>
		| ((
				...args: Array<any>
		  ) => BasicArg | ObjArg | Array<ObjArg> | Promise<BasicArg | ObjArg | Array<ObjArg>>)
}

export type ObjArgBase = ObjArg | null

export type BuildObjArg<Current extends ObjArgBase, Next extends ObjArgBase> = [
	Current,
] extends [null]
	? Next
	: [Next] extends [null]
		? Current
		: Current & Next
