import { objectEntries, type BaseObject, type TruePropertyKey } from "#util/base-type.js"
import type { XisIssue, XisIssueBase } from "#core/error.js"
import { CheckSide, type XisPath } from "#core/path.js"
import {
	type ExArgs,
	type ExIssues,
	type ExOut,
	type ExIn,
	type XisBase,
	mergeIssues,
} from "#core/kernel.js"
import { Left, Right } from "purify-ts/Either"
import type { ExecResultSync } from "#core/sync.js"

export type WritableRequiredKey<K extends TruePropertyKey> = [K, "!"]
export type WritableRequiredKeyBase = WritableRequiredKey<TruePropertyKey>
export type WritableOptionalKey<K extends TruePropertyKey> = [K, "?"]
export type WritableOptionalKeyBase = WritableOptionalKey<TruePropertyKey>
export type ReadOnlyRequiredKey<K extends TruePropertyKey> = ["readonly", K, "!"]
export type ReadOnlyRequiredKeyBase = ReadOnlyRequiredKey<TruePropertyKey>
export type ReadOnlyOptionalKey<K extends TruePropertyKey> = ["readonly", K, "?"]
export type ReadOnlyOptionalKeyBase = ReadOnlyOptionalKey<TruePropertyKey>

export type WritableKey<K extends TruePropertyKey> =
	| WritableRequiredKey<K>
	| WritableOptionalKey<K>
export type WritableKeyBase = WritableKey<TruePropertyKey>
export type ReadOnlyKey<K extends TruePropertyKey> =
	| ReadOnlyRequiredKey<K>
	| ReadOnlyOptionalKey<K>
export type ReadOnlyKeyBase = ReadOnlyKey<TruePropertyKey>
export type OptionalKey<K extends TruePropertyKey> =
	| WritableOptionalKey<K>
	| ReadOnlyOptionalKey<K>
export type OptionalKeyBase = OptionalKey<TruePropertyKey>
export type RequiredKey<K extends TruePropertyKey> =
	| WritableRequiredKey<K>
	| ReadOnlyRequiredKey<K>
export type RequiredKeyBase = RequiredKey<TruePropertyKey>

export type ShapeKey<K extends TruePropertyKey> =
	| WritableRequiredKey<K>
	| ReadOnlyRequiredKey<K>
	| WritableOptionalKey<K>
	| ReadOnlyOptionalKey<K>

export type ShapeKeyBase = ShapeKey<TruePropertyKey>

export type ExKeyName<Key extends ShapeKeyBase> =
	Key extends ShapeKey<infer KeyName> ? KeyName : never

export type Prop<Key extends ShapeKeyBase, Schema extends XisBase> = [Key, Schema]

export type BaseProp = Prop<ShapeKey, XisBase>

export type UnionToIntersection<T> = [T] extends [never]
	? undefined
	: (T extends any ? (x: T) => void : never) extends (x: infer R) => void
		? R
		: never

export interface MissingPropertyIssue extends XisIssue<"XIS_MISSING_PROPERTY"> {}

export interface ExtraPropertyIssue extends XisIssue<"XIS_EXTRA_PROPERTY"> {
	value: unknown
}

export type Mutable<R extends BaseObject> = {
	-readonly [P in keyof R]: R[P]
}

export type RecordIntersection<A, B> = A & B extends infer U ? { [P in keyof U]: U[P] } : never

export type Shape<
	Keys extends [...Array<ShapeKeyBase>],
	Acc extends object = object,
> = Keys extends [infer Key extends ShapeKeyBase, ...infer Rest extends Array<ShapeKeyBase>]
	? [Key] extends [WritableRequiredKeyBase]
		? Shape<Rest, Acc & { [P in ExKeyName<Key>]: unknown }>
		: [Key] extends [WritableOptionalKeyBase]
			? Shape<Rest, Acc & { [P in ExKeyName<Key>]?: unknown }>
			: [Key] extends [ReadOnlyRequiredKeyBase]
				? Shape<Rest, Acc & { readonly [P in ExKeyName<Key>]: unknown }>
				: [Key] extends [ReadOnlyOptionalKeyBase]
					? Shape<Rest, Acc & { readonly [P in ExKeyName<Key>]?: unknown }>
					: never
	: Acc

export const ShapeCheckMode = {
	PASS_THROUGH: "passThrough",
	STRIP: "strip",
	STRICT: "strict",
} as const

export type ShapeCheckMode = (typeof ShapeCheckMode)[keyof typeof ShapeCheckMode]

export type PassThrough = typeof ShapeCheckMode.PASS_THROUGH

export type Strip = typeof ShapeCheckMode.STRIP

export type Strict = typeof ShapeCheckMode.STRICT

export type ShapeDefaultMode = Strip

export type ShapePropGuardIssues<
	S extends [...Array<BaseProp>],
	Acc extends XisIssueBase = never,
> = S extends [[BaseKey, infer C extends XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? ShapePropGuardIssues<Rest, Acc | ExIssues<C>>
	: Acc

export type ShapePropExecIssues<
	S extends [...Array<BaseProp>],
	Acc extends XisIssueBase = never,
> = S extends [[BaseKey, infer C extends XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? ShapePropExecIssues<Rest, Acc | ExIssues<C>>
	: Acc

export type StripShapeIn<S extends [...Array<BaseProp>]> =
	SchemaShape<S> extends infer SS
		? {
				[P in keyof SS]: Exclude<SS[P], undefined> extends infer C extends XisBase
					? ExIn<C>
					: never
			}
		: never

export type StripShapeOut<S extends [...Array<BaseProp>]> =
	SchemaShape<S> extends infer SS
		? {
				[P in keyof SS]: Exclude<SS[P], undefined> extends infer C extends XisBase
					? ExOut<C>
					: never
			}
		: never

export type ShapeIn<S extends [...Array<BaseProp>], CM extends ShapeCheckMode> = [CM] extends [
	PassThrough | Strip,
]
	? StripShapeIn<S> & BaseObject
	: StripShapeIn<S>

export type ShapeGuardIssues<S extends [...Array<BaseProp>], CM extends ShapeCheckMode> = [
	CM,
] extends [Strict]
	?
			| ShapePropGuardIssues<S>
			| ExtraPropertyIssue
			| MissingPropertyIssue
			| BaseTypeIssue<"object">
	: ShapePropGuardIssues<S> | MissingPropertyIssue | BaseTypeIssue<"object">

export type ShapeExecIssues<S extends [...Array<BaseProp>], CM extends ShapeCheckMode> = [
	CM,
] extends [Strict]
	? ShapePropExecIssues<S> | ExtraPropertyIssue
	: ShapePropExecIssues<S>

export type ShapeOut<S extends [...Array<BaseProp>], CM extends ShapeCheckMode> = [CM] extends [
	PassThrough,
]
	? StripShapeOut<S> & BaseObject
	: StripShapeOut<S>

export type ShapeArgs<
	S extends [...Array<BaseProp>],
	Acc extends XisOptArgs = undefined,
> = S extends [[BaseKey, infer C extends XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? ShapeArgs<Rest, Acc & ExArgs<C>>
	: Acc

const missingIssues = (
	missingEntries: Array<TruePropertyKey>,
	path: XisPath
): Array<MissingPropertyIssue> =>
	missingEntries.map(
		(key) =>
			({
				name: "MISSING_PROPERTY",
				path: [
					...path,
					{
						segment: key,
						side: CheckSide.Value,
					},
				],
			}) satisfies MissingPropertyIssue
	)

const extraIssues = (
	extraEntries: Map<TruePropertyKey, unknown>,
	path: XisPath
): Array<ExtraPropertyIssue> =>
	[...extraEntries.entries()].map(
		([key, value]) =>
			({
				name: "EXTRA_PROPERTY",
				value,
				path: [
					...path,
					{
						segment: key,
						side: CheckSide.Value,
					},
				],
			}) satisfies ExtraPropertyIssue
	)

type Triad<S extends [...Array<BaseProp>]> = [TruePropertyKey, S[number][1], unknown]

const marshal = <S extends [...Array<BaseProp>]>(
	shape: S,
	obj: BaseObject
): [Map<TruePropertyKey, unknown>, Array<Triad<S>>, Array<TruePropertyKey>] => {
	type Res = [Map<TruePropertyKey, unknown>, Array<Triad<S>>, Array<TruePropertyKey>]
	return shape.reduce<Res>(
		([remaining, pending, missing], [key, propCheck]) => {
			const trueKey = key.k

			if (remaining.has(trueKey)) {
				const res = [trueKey, propCheck, remaining.get(trueKey)] satisfies Triad<S>
				remaining.delete(trueKey)
				pending.push(res)
			} else if (key.o === false) {
				missing.push(trueKey)
			}
			return [remaining, pending, missing]
		},
		[new Map(objectEntries(obj)), new Array<Triad<S>>(), new Array<TruePropertyKey>()]
	)
}

export const guard = <S extends [...Array<BaseProp>], CM extends ShapeCheckMode>(
	value: unknown,
	shape: S,
	checkMode: CM,
	ctx: XisArgObjBase
): ExecResultSync<
	BaseTypeIssue<"object"> | MissingPropertyIssue | ExtraPropertyIssue,
	[Array<Triad<S>>, Array<[TruePropertyKey, unknown]>]
> => {
	type Res = [Array<Triad<S>>, Array<[TruePropertyKey, unknown]>]
	return isBaseObject(value, ctx).chain((obj) => {
		const [remaining, pending, missing] = marshal(shape, obj)

		const remainingErrs =
			checkMode === ShapeCheckMode.STRICT ? extraIssues(remaining, ctx.path) : []
		const missingErrs = missingIssues(missing, ctx.path)
		const extraProps = checkMode === ShapeCheckMode.PASS_THROUGH ? [...remaining.entries()] : []

		const errs = [...remainingErrs, ...missingErrs]

		if (errs.length === 0) {
			return Right([pending, extraProps] satisfies Res)
		}
		return Left(errs)
	})
}
export const reduce = (
	mapped: Array<ExecResultSync<XisIssueBase, [TruePropertyKey, unknown]>>,
	extra: Array<[TruePropertyKey, unknown]>
): ExecResultSync<XisIssueBase, Record<TruePropertyKey, unknown>> =>
	mapped
		.reduce<ExecResultSync<XisIssueBase, Array<[TruePropertyKey, unknown]>>>(
			(acc, elem) =>
				elem.caseOf({
					Left: (issues) => mergeIssues(acc, issues),
					Right: (next) => acc.map((base) => [...base, next]),
				}),
			Right<Array<[TruePropertyKey, unknown]>, Array<XisIssueBase>>([])
		)
		.map((elem) => Object.fromEntries([...elem, ...extra]))
