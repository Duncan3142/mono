import { Array } from "effect"
import type { TagJoin } from "./tag.join.ts"

type Tag<
	Prefix extends string,
	Segments extends [...Array.NonEmptyReadonlyArray<string>],
> = `${Prefix}${TagJoin<[...Segments]>}`

/**
 * Generates namespaced tag builder.
 * @param prefix - The service prefix
 * @returns A tag builder function
 */
const make =
	<Prefix extends string>(prefix: Prefix) =>
	/**
	 * Generates a namespaced tag string.
	 * This function takes a variable number of string segments and combines them into a namespaced tag.
	 * @param segments - The string segments to include in the tag.
	 * @returns A namespaced tag string of the format `<prefix>[/<segments>]`.
	 */
	<Segments extends [...Array.NonEmptyReadonlyArray<string>]>(
		...segments: readonly [...Segments]
	): Tag<Prefix, Segments> =>
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Typescript does not support variadic generics in this context
		`${prefix}/${Array.join(segments, "/")}` as Tag<Prefix, Segments>

export { make }
export type { Tag }
