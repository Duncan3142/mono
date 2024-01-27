import type { TruePropertyKey } from "#util/base-type.js"
import type { XisIssue } from "#core/error.js"
import { CheckSide, type XisPath } from "#core/path.js"

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

export type UnionToIntersection<T> = [T] extends [never]
	? undefined
	: (T extends any ? (x: T) => void : never) extends (x: infer R) => void
		? R
		: never

export interface MissingPropertyIssue extends XisIssue<"XIS_MISSING_PROPERTY"> {}

export interface ExtraPropertyIssue extends XisIssue<"XIS_EXTRA_PROPERTY"> {
	value: unknown
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

export const missingIssues = (
	missingEntries: Array<TruePropertyKey>,
	path: XisPath
): Array<MissingPropertyIssue> =>
	missingEntries.map(
		(key) =>
			({
				name: "XIS_MISSING_PROPERTY",
				message: `Missing property "${String(key)}"`,
				path: [
					...path,
					{
						segment: key,
						side: CheckSide.Value,
					},
				],
			}) satisfies MissingPropertyIssue
	)

export const extraIssues = (
	extraEntries: Map<TruePropertyKey, unknown>,
	path: XisPath
): Array<ExtraPropertyIssue> =>
	[...extraEntries.entries()].map(
		([key, value]) =>
			({
				name: "XIS_EXTRA_PROPERTY",
				value,
				message: `Extra property "${String(key)}"`,
				path: [
					...path,
					{
						segment: key,
						side: CheckSide.Value,
					},
				],
			}) satisfies ExtraPropertyIssue
	)
