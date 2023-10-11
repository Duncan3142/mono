export type NonEmptyArray<T> = [T, ...Array<T>]

export function assertIsNonEmptyArray<T>(
	array: ReadonlyArray<T>
): asserts array is NonEmptyArray<T> {
	if (array.length === 0) {
		throw new Error("Expected non-empty array")
	}
}

export function nonEmptyArray<T>(arr: Array<T>): NonEmptyArray<T> {
	assertIsNonEmptyArray(arr)
	return arr
}
