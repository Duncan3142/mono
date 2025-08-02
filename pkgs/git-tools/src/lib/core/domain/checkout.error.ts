import { Data } from "effect"
import { SERVICE_PREFIX } from "#const"

const CHECKOUT_REF_NOT_FOUND_ERROR_TAG = `${SERVICE_PREFIX}/CHECKOUT_REF_NOT_FOUND_ERROR`

/**
 * Checkout Ref Not Found Error
 */
class CheckoutRefNotFoundError extends Data.TaggedError(CHECKOUT_REF_NOT_FOUND_ERROR_TAG)<{
	ref: string
}> {}

export { CheckoutRefNotFoundError, CHECKOUT_REF_NOT_FOUND_ERROR_TAG }
