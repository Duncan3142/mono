import type { NonEmptyArray, NonEmptyReadonlyArray } from "effect/Array"
import { dual } from "effect/Function"
import type { ReadonlyRecord } from "effect/Record"

type ArrayGroups<A, K extends string | symbol> = Partial<
	ReadonlyRecord<K, NonEmptyReadonlyArray<A>>
>

const ARITY_TWO = 2

const groupBy: {
	/**
	 * Splits an `Iterable` into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
	 * function on each element, and grouping the results according to values returned
	 *
	 * **Example**
	 *
	 * ```ts
	 *
	 * const people = [
	 * { name: "Alice", group: "A" },
	 * { name: "Bob", group: "B" },
	 * { name: "Charlie", group: "A" }
	 * ]
	 *
	 * const result = groupBy(people, person => person.group)
	 * console.log(result)
	 * // {
	 * //  A: [{ name: "Alice", group: "A" }, { name: "Charlie", group: "A" }],
	 * //  B: [{ name: "Bob", group: "B" }]
	 * // }
	 * ```
	 */
	<A, K extends string | symbol>(f: (a: A) => K): (self: Iterable<A>) => ArrayGroups<A, K>
	/**
	 * Splits an `Iterable` into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
	 * function on each element, and grouping the results according to values returned
	 *
	 * **Example**
	 *
	 * ```ts
	 *
	 * const people = [
	 * { name: "Alice", group: "A" },
	 * { name: "Bob", group: "B" },
	 * { name: "Charlie", group: "A" }
	 * ]
	 *
	 * const result = groupBy(people, person => person.group)
	 * console.log(result)
	 * // {
	 * //  A: [{ name: "Alice", group: "A" }, { name: "Charlie", group: "A" }],
	 * //  B: [{ name: "Bob", group: "B" }]
	 * // }
	 * ```
	 */
	<A, K extends string | symbol>(self: Iterable<A>, f: (a: A) => K): ArrayGroups<A, K>
} = dual(
	ARITY_TWO,
	<A, K extends string | symbol>(self: Iterable<A>, f: (a: A) => K): ArrayGroups<A, K> => {
		const result: Partial<Record<K, NonEmptyArray<A>>> = {}
		for (const a of self) {
			const key = f(a)
			if (Object.prototype.hasOwnProperty.call(result, key)) {
				result[key]?.push(a)
			} else {
				result[key] = [a]
			}
		}
		return result
	}
)

// eslint-disable-next-line import-x/prefer-default-export -- Expect more
export { groupBy }
