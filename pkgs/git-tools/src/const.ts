import { Array } from "effect"
import type { Join } from "./tuple.ts"

const BASE_10_RADIX = 10
const SERVICE_PREFIX = "@duncan3142/git-tools"

type Tag<Segments extends [...Array.NonEmptyReadonlyArray<string>]> =
	`${typeof SERVICE_PREFIX}${Join<[...Segments]>}`

/**
 * Generates a namespaced tag string.
 * This function takes a variable number of string segments and combines them into a namespaced tag.
 * @param segments - The string segments to include in the tag.
 * @returns A namespaced tag string in the format `@duncan3142/git-tools[/<segments>]`.
 */
const tag = <Segments extends [...Array.NonEmptyReadonlyArray<string>]>(
	...segments: [...Segments]
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Typescript does not support variadic generics in this context
): Tag<Segments> => `${SERVICE_PREFIX}/${Array.join(segments, "/")}` as Tag<Segments>

export { BASE_10_RADIX, tag }
