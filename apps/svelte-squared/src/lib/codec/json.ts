import { Codec, string } from "purify-ts/Codec"
import { Either } from "purify-ts/Either"

/**
 * JSON string codec wrapper
 * @param codec - Codec to apply to parsed JSON
 * @returns JSON string codec
 */
const jsonString = <T>(codec: Codec<T>): Codec<T> =>
	Codec.custom<T>({
		decode: (input) =>
			string
				.decode(input)
				.chain((s) =>
					Either.encase<Error, unknown>(() => JSON.parse(s)).mapLeft((e) => e.message)
				)
				.chain((value) => codec.decode(value)),
		encode: (input) => JSON.stringify(codec.encode(input)),
		schema: () => codec.schema(),
	})

export default jsonString
