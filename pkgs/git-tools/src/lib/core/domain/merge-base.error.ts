import { Data } from "effect"
import * as Const from "#const"

const MERGE_BASE_NOT_FOUND_ERROR_TAG = Const.tag("domain", `MERGE_BASE_NOT_FOUND_ERROR`)

/**
 * Fetch Not Found Error
 */
class NotFound extends Data.TaggedError(MERGE_BASE_NOT_FOUND_ERROR_TAG)<{
	headRef: string
	baseRef: string
	cause?: Error
}> {}

export { NotFound, MERGE_BASE_NOT_FOUND_ERROR_TAG }
