import type { TruePropertyKey } from "#util/base-type.js"
import type { XisIssue } from "#core/error.js"
import type { XisPath } from "#core/path.js"
import type { XisMsgArgs, XisMsgBuilder } from "#core/messages.js"

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

export function isOptionalKey(key: ShapeKeyBase): key is OptionalKeyBase {
	return (key.length === 3 && key[2] === "?") || (key.length === 2 && key[1] === "?")
}

export const exKeyName = <Key extends ShapeKeyBase>(key: Key): ExKeyName<Key> =>
	(key.length === 3 ? key[1] : key[0]) as ExKeyName<Key>

export type ExKeyName<Key extends ShapeKeyBase> =
	Key extends ShapeKey<infer KeyName> ? KeyName : never

export type UnionToIntersection<T> = [T] extends [never]
	? undefined
	: (T extends any ? (x: T) => void : never) extends (x: infer R) => void
		? R
		: never

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

export interface MissingPropertyIssue extends XisIssue<"XIS_MISSING_PROPERTY"> {
	key: TruePropertyKey
}

export type XIS_MISSING_PROPERTY = XisMsgBuilder<TruePropertyKey>

export const XIS_MISSING_PROPERTY = (args: XisMsgArgs<TruePropertyKey>) => {
	const { value, path } = args
	return `object missing property "${String(value)}" at path "${JSON.stringify(path)}"`
}

export interface MissingIssuesArgs {
	key: TruePropertyKey
	locale: string
	msgBuilder: XIS_MISSING_PROPERTY
	path: XisPath
}

export const missingIssue = (args: MissingIssuesArgs): MissingPropertyIssue => {
	const { key, locale, msgBuilder, path } = args
	return {
		name: "XIS_MISSING_PROPERTY" as const,
		key,
		message: msgBuilder({ value: key, path, locale, props: null, ctx: null }),
		path,
	}
}
