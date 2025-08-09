import { Data } from "effect"
import { Tag } from "#const"

const CHECKOUT_REF_NOT_FOUND_ERROR_TAG = Tag.make("domain", `CHECKOUT_REF_NOT_FOUND_ERROR`)

/**
 * Checkout Ref Not Found Error
 */
class RefNotFound extends Data.TaggedError(CHECKOUT_REF_NOT_FOUND_ERROR_TAG)<{
	ref: string
}> {}

export { RefNotFound, CHECKOUT_REF_NOT_FOUND_ERROR_TAG }
