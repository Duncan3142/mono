import { objectEntries, type BaseObject, type TruePropertyKey } from "#util/base-type.js"
import { isBaseObject, type BaseTypeIssue } from "#core/base-type.js"
import type { XisIssue, XisIssueBase } from "#core/error.js"

import { CheckSide, type XisArgObjBase, type XisOptArgs, type XisPath } from "#core/context.js"

import {
	type ExArgs,
	type ExGuardIssues,
	type ExExecIssues,
	type ExOut,
	type ExIn,
	type XisBase,
	mergeIssues,
} from "#core/kernel.js"

import { Left, Right } from "purify-ts/Either"
import type { ExecResultSync } from "#core/sync.js"

export type WritableRequiredKey = [TruePropertyKey, "!"]
export type WritableOptionalKey = [TruePropertyKey, "?"]
export type ReadOnlyRequiredKey = ["readonly", TruePropertyKey, "!"]
export type ReadOnlyOptionalKey = ["readonly", TruePropertyKey, "?"]

export type ShapeKey =
	| WritableRequiredKey
	| ReadOnlyRequiredKey
	| WritableOptionalKey
	| ReadOnlyOptionalKey

export type Key<
	Key extends TruePropertyKey,
	ReadOnly extends boolean,
	Optional extends boolean,
> = {
	k: Key
	r: ReadOnly
	o: Optional
}

export type K<PK extends TruePropertyKey> = Key<PK, true, false>
export const k = <PK extends TruePropertyKey>(k: PK): K<PK> => {
	return {
		k,
		r: true,
		o: false,
	}
}

export type KW<PK extends TruePropertyKey> = Key<PK, false, false>
export const kw = <PK extends TruePropertyKey>(k: PK): KW<PK> => {
	return {
		k,
		r: false,
		o: false,
	}
}

export type KO<PK extends TruePropertyKey> = Key<PK, true, true>
export const ko = <PK extends TruePropertyKey>(k: PK): KO<PK> => {
	return {
		k,
		r: true,
		o: true,
	}
}

export type KWO<PK extends TruePropertyKey> = Key<PK, false, true>
export const kwo = <PK extends TruePropertyKey>(k: PK): KWO<PK> => {
	return {
		k,
		r: false,
		o: true,
	}
}

export type BaseKey = Key<TruePropertyKey, boolean, boolean>

export type ExKey<K extends BaseKey> = K["k"]

export type RequiredKey = Key<TruePropertyKey, boolean, false>

export type OptionalKey = Key<TruePropertyKey, boolean, true>

export type ReadonlyKey = Key<TruePropertyKey, true, boolean>

export type MutableKey = Key<TruePropertyKey, false, boolean>

export type Prop<K extends BaseKey, X extends XisBase> = [key: K, schema: X]

export type BaseProp = Prop<BaseKey, XisBase>

export type UnionToIntersection<T> = [T] extends [never]
	? undefined
	: (T extends any ? (x: T) => void : never) extends (x: infer R) => void
		? R
		: never

export interface MissingPropertyIssue extends XisIssue<"MISSING_PROPERTY"> {}

export interface ExtraPropertyIssue extends XisIssue<"EXTRA_PROPERTY"> {
	value: unknown
}

export type Mutable<R extends BaseObject> = {
	-readonly [P in keyof R]: R[P]
}

export type RecordIntersection<A, B> = A & B extends infer U ? { [P in keyof U]: U[P] } : never

export type RequiredKeys<
	S extends [...Array<BaseProp>],
	Acc extends Array<TruePropertyKey> = [],
> = S extends [[infer Key extends BaseKey, XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? [Key] extends [RequiredKey]
		? RequiredKeys<Rest, [...Acc, ExKey<Key>]>
		: RequiredKeys<Rest, Acc>
	: Acc

export type OptionalKeys<
	S extends [...Array<BaseProp>],
	Acc extends [...Array<TruePropertyKey>] = [],
> = S extends [[infer Key, XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? Key extends OptionalKey
		? OptionalKeys<Rest, [...Acc, ExKey<Key>]>
		: OptionalKeys<Rest, Acc>
	: Acc

export type ReadonlyKeys<
	S extends [...Array<BaseProp>],
	Acc extends [...Array<TruePropertyKey>] = [],
> = S extends [[infer Key, XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? Key extends ReadonlyKey
		? ReadonlyKeys<Rest, [...Acc, ExKey<Key>]>
		: ReadonlyKeys<Rest, Acc>
	: Acc

export type MutableKeys<
	S extends [...Array<BaseProp>],
	Acc extends [...Array<TruePropertyKey>] = [],
> = S extends [[infer Key, XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? Key extends MutableKey
		? MutableKeys<Rest, [...Acc, ExKey<Key>]>
		: MutableKeys<Rest, Acc>
	: Acc

export type SchemaCore<S extends [...Array<BaseProp>], Acc = unknown> = S extends [
	[infer K extends BaseKey, infer Check extends XisBase],
	...infer Rest extends [...Array<BaseProp>],
]
	? SchemaCore<Rest, Acc & { [P in K as ExKey<P>]: Check }>
	: Acc

export type SchemaShape<S extends [...Array<BaseProp>]> =
	SchemaCore<S> extends infer SC
		? RecordIntersection<
				Mutable<Pick<SC, MutableKeys<S>[number]>>,
				Readonly<Pick<SC, ReadonlyKeys<S>[number]>>
			> extends infer RM
			? RecordIntersection<
					Required<Pick<RM, RequiredKeys<S>[number]>>,
					Partial<Pick<RM, OptionalKeys<S>[number]>>
				>
			: never
		: never

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
	? ShapePropGuardIssues<Rest, Acc | ExGuardIssues<C>>
	: Acc

export type ShapePropExecIssues<
	S extends [...Array<BaseProp>],
	Acc extends XisIssueBase = never,
> = S extends [[BaseKey, infer C extends XisBase], ...infer Rest extends [...Array<BaseProp>]]
	? ShapePropExecIssues<Rest, Acc | ExExecIssues<C>>
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
