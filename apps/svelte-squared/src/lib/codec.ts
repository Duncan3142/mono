import { Codec } from "purify-ts/Codec"
import type { Either } from "purify-ts/Either"
import { Left, Right } from "purify-ts/Either"

/**
 * Parse JSON string
 * @param input - Input string to parse
 * @returns Parsed JSON Either
 */
const jsonParse = (input: unknown): Either<string, unknown> => {
	if (typeof input === "string") {
		try {
			return Right<unknown>(JSON.parse(input))
		} catch {
			return Left("Invalid JSON string")
		}
	}
	return Left("Expected string for parsing")
}

/**
 * JSON string codec wrapper
 * @param codec - Codec to apply to parsed JSON
 * @returns JSON string codec
 */
const jsonString = <T>(codec: Codec<T>): Codec<T> =>
	Codec.custom<T>({
		decode: (input) => jsonParse(input).chain((value) => codec.decode(value)),
		encode: (input) => JSON.stringify(codec.encode(input)),
		schema: () => codec.schema(),
	})

export { jsonString }
export default jsonString
