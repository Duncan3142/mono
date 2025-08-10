import { Data } from "effect"

type CheckoutMode = Data.TaggedEnum<{
	Create: object
	Standard: object
}>

const { $is, $match, Create, Standard } = Data.taggedEnum<CheckoutMode>()

export { Create, Standard, $is, $match }
export type { CheckoutMode }
