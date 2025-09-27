import { SERVICE_PREFIX } from "./const.ts"
import { TagFactory } from "#duncan3142/effect/lib/tag"

const make = TagFactory.make(SERVICE_PREFIX)

export { make }
