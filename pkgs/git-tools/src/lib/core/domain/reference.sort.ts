import { Order } from "effect"
import { Reference } from "#duncan3142/git-tools/domain"

/**
 * Order reference by type
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const byTag: Order.Order<Reference.Reference> = Order.mapInput(Order.string, ({ _tag }) => _tag)

/**
 * Order reference order by name
 * @param reference - Reference to check
 * @returns Reference ordering
 */
const byName: Order.Order<Reference.Reference> = Order.mapInput(
	Order.string,
	({ name }) => name
)

export { byTag, byName }
