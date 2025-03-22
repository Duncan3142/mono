import type { ExCtx, ExIn, ExIssues, ExOut, XisBase } from "#core/kernel.js"
import type { ObjArgBase } from "#util/arg.js"
import type {
	ExKeyName,
	ReadOnlyOptionalKeyBase,
	ReadOnlyRequiredKeyBase,
	ShapeKeyBase,
	WritableOptionalKeyBase,
	WritableRequiredKeyBase,
} from "../shape/core.js"

export type XisPropBase = [ShapeKeyBase, XisBase]
export type XisPropsBase = Array<XisPropBase>

const object_meta = Symbol("object meta")

type ObjectBase = Record<PropertyKey, unknown>

interface ObjectMeta<Base extends ObjectBase> {
	readonly: "all" | "none" | Array<keyof Base>
	optional: "all" | "none" | Array<keyof Base>
}

type Shape<Base extends ObjectBase, Meta extends ObjectMeta<Base>> = Base & {
	[object_meta]: Meta
}

interface ShapeFactory {
	<Base extends ObjectBase>(base: Base): Shape<Base, { readonly: "none"; optional: "none" }>
	<Base extends ObjectBase, Meta extends ObjectMeta<Base>>(
		base: Base,
		meta: Meta
	): Shape<Base, Meta>
}

const shape: ShapeFactory = <Base extends ObjectBase, Meta extends ObjectMeta<Base>>(
	base: Base,
	meta?: Meta
) => {
	return {
		...base,
		[object_meta]: typeof meta === "undefined" ? { readonly: "none", optional: "none" } : meta,
	}
}

export type NativeShape<
	Props extends [...Array<XisPropBase>],
	Acc extends object = object,
> = Props extends [infer Prop extends XisPropBase, ...infer Rest extends Array<XisPropBase>]
	? [Prop[0]] extends [WritableRequiredKeyBase]
		? NativeShape<Rest, Acc & { [P in ExKeyName<Prop[0]>]: Prop[1] }>
		: [Prop[0]] extends [WritableOptionalKeyBase]
			? NativeShape<Rest, Acc & { [P in ExKeyName<Prop[0]>]?: Prop[1] }>
			: [Prop[0]] extends [ReadOnlyRequiredKeyBase]
				? NativeShape<Rest, Acc & { readonly [P in ExKeyName<Prop[0]>]: Prop[1] }>
				: [Prop[0]] extends [ReadOnlyOptionalKeyBase]
					? NativeShape<Rest, Acc & { readonly [P in ExKeyName<Prop[0]>]?: Prop[1] }>
					: never
	: Acc

// export type RecordIntersection<A, B> = A & B extends infer U ? { [P in keyof U]: U[P] } : never

export type XisObjectIn<Props extends XisPropsBase> =
	NativeShape<Props> extends infer S
		? {
				[K in keyof S]: Exclude<S[K], undefined> extends infer X extends XisBase
					? ExIn<X>
					: never
			}
		: never

export type XisObjectIssues<Props extends XisPropsBase> =
	NativeShape<Props> extends infer S
		? Exclude<
				{
					[K in keyof S]: Exclude<S[K], undefined> extends infer X extends XisBase
						? ExIssues<X>
						: never
				}[keyof S],
				undefined
			>
		: never

export type XisObjectOut<Props extends XisPropsBase> =
	NativeShape<Props> extends infer S
		? {
				[K in keyof S]: Exclude<S[K], undefined> extends infer X extends XisBase
					? ExOut<X>
					: never
			}
		: never

export type CtxUnionIntersection<T extends ObjArgBase> = (
	T extends any ? (x: T) => void : never
) extends (x: infer R) => void
	? R extends ObjArgBase
		? R
		: never
	: never

export type XisObjectCtx<Props extends XisPropsBase> = CtxUnionIntersection<
	Exclude<
		NativeShape<Props> extends infer S
			? Exclude<
					{
						[K in keyof S]: Exclude<S[K], undefined> extends infer X extends XisBase
							? ExCtx<X>
							: never
					}[keyof S],
					undefined
				>
			: never,
		null
	>
>
