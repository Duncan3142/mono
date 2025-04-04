export type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false

export type BaseArray = Array<unknown>

export type TruePropertyKey = string | symbol

export type BaseProp = [TruePropertyKey, unknown]

export type BaseObject = Record<TruePropertyKey, unknown>

export type BaseMap = Map<unknown, unknown>

export type BaseSet = Set<unknown>

export type BaseFunction = (...args: Array<any>) => unknown

export type NTuple<N extends number, T = unknown, R extends Array<T> = []> = N extends number
	? [R["length"]] extends [N]
		? R
		: NTuple<N, T, [T, ...R]>
	: never

export interface TruePrimitiveTypeNameMap {
	null: null
	undefined: undefined
	string: string
	number: number
	boolean: boolean
	bigint: bigint
	symbol: symbol
}

export type TruePrimitiveTypeName = keyof TruePrimitiveTypeNameMap

export type TruePrimitiveType = TruePrimitiveTypeNameMap[TruePrimitiveTypeName]

export interface TrueObjectTypeNameMap {
	array: BaseArray
	date: Date
	map: BaseMap
	set: BaseSet
	object: BaseObject
	function: BaseFunction
}

export type TrueObjectTypeName = keyof TrueObjectTypeNameMap

export type TrueBaseTypeNameMap = TruePrimitiveTypeNameMap & TrueObjectTypeNameMap

export type TrueBaseTypeName = TruePrimitiveTypeName | TrueObjectTypeName

export const trueTypeOf = (x: unknown): TrueBaseTypeName => {
	if (x === null) return "null"
	if (Array.isArray(x)) return "array"
	if (x instanceof Date) return "date"
	if (x instanceof Map) return "map"
	if (x instanceof Set) return "set"
	return typeof x
}

export const stringify = (x: unknown): string =>
	JSON.stringify(x, (_: unknown, value: unknown) =>
		typeof value === "symbol" ? String(value) : value
	)

export const isBaseType = <N extends TrueBaseTypeName>(
	typeName: N,
	value: unknown
): value is TrueBaseTypeNameMap[N] => trueTypeOf(value) === typeName

export function assertBaseType<N extends TrueBaseTypeName>(
	typeName: N,
	value: unknown
): asserts value is TrueBaseTypeNameMap[N] {
	if (!isBaseType(typeName, value)) {
		throw new TypeError(`Expected ${typeName}, received ${trueTypeOf(value)}`)
	}
}

export type TrueKey<K extends PropertyKey> = K extends number ? `${K}` : K

export type Entry<O> = {
	[K in keyof O]: [TrueKey<K>, O[K]]
}[keyof O]

export type Entries<O> = Array<Entry<O>>

export const objectEntries = <const Obj extends BaseObject>(obj: Obj): Entries<Obj> => {
	const keys = Reflect.ownKeys(obj)
	return keys.map((key) => [key, obj[key]]) as Entries<Obj>
}

export const tup = <Args extends Array<any>>(...args: Args) => args
