import type { TruePropertyKey } from "./base-type.js"

export type BasicArg = string | number | boolean | undefined | symbol | object | null | bigint

export interface ObjArg {
	[prop: TruePropertyKey]:
		| BasicArg
		| Array<BasicArg>
		| ObjArg
		| Array<ObjArg>
		| Promise<BasicArg | Array<BasicArg>>
		| Promise<ObjArg | Array<ObjArg>>
		| ((
				...args: Array<any>
		  ) =>
				| BasicArg
				| Array<BasicArg>
				| ObjArg
				| Array<ObjArg>
				| Promise<BasicArg | Array<BasicArg> | ObjArg | Array<ObjArg>>)
}

export type ObjArgBase = ObjArg | null

export type BuildObjArg<Current extends ObjArgBase, Next extends ObjArgBase> = [
	Current,
] extends [null]
	? Next
	: [Next] extends [null]
		? Current
		: Current & Next
