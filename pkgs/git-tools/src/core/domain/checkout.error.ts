import { Data } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"

const CHECKOUT_REF_NOT_FOUND_ERROR_TAG = TagFactory.make(
	"domain",
	`CHECKOUT_REF_NOT_FOUND_ERROR`
)

/**
 * Checkout Ref Not Found Error
 */
class CheckoutRefNotFound extends Data.TaggedError(CHECKOUT_REF_NOT_FOUND_ERROR_TAG)<{
	ref: string
}> {}

export { CheckoutRefNotFound, CHECKOUT_REF_NOT_FOUND_ERROR_TAG }
