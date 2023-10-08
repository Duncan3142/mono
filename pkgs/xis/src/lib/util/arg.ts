import type { TruePropertyKey } from "./base-type.js"

export type ObjArgBase = Record<TruePropertyKey, unknown>

export type BuildObjArg<Current extends ObjArgBase, Next extends ObjArgBase> = Current & Next
