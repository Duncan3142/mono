import type { Array } from "effect"

const BASE_10_RADIX = 10
const SERVICE_PREFIX = "@duncan3142/git-tools"

type TagSegments<
	Segments extends [...Array<string>],
	Acc extends string = "",
> = Segments extends []
	? Acc
	: Segments extends [infer Head, ...infer Tail]
		? Head extends string
			? Tail extends Array<string>
				? TagSegments<Tail, `${Acc}/${Head}`>
				: never
			: never
		: never

type Tag<Segments extends [...Array.NonEmptyReadonlyArray<string>]> =
	`${typeof SERVICE_PREFIX}${TagSegments<Segments>}`

/**
 * Generates a namespaced tag string.
 * This function takes a variable number of string segments and combines them into a namespaced tag.
 * @param segments - The string segments to include in the tag.
 * @returns A namespaced tag string in the format `@duncan3142/git-tools[/<segments>]`.
 */
const tag = <Segments extends [...Array.NonEmptyReadonlyArray<string>]>(
	...segments: [...Segments]
): Tag<Segments> =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- TypeScript does not infer the type correctly here
	`${SERVICE_PREFIX}/${segments.join("/")}` as Tag<Segments>

export { BASE_10_RADIX, tag }
