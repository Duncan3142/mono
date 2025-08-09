import { Data } from "effect"
import { tag } from "#const"

const CHECKOUT_REF_NOT_FOUND_ERROR_TAG = tag("domain", `CHECKOUT_REF_NOT_FOUND_ERROR`)

/**
 * Checkout Ref Not Found Error
 */
class CheckoutRefNotFoundError extends Data.TaggedError(CHECKOUT_REF_NOT_FOUND_ERROR_TAG)<{
	ref: string
}> {}

export { CheckoutRefNotFoundError, CHECKOUT_REF_NOT_FOUND_ERROR_TAG }
