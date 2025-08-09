import type { Duration, Option } from "effect"
import { Data } from "effect"
import * as Const from "#const"

const GIT_COMMAND_TIMEOUT_ERROR_TAG = Const.tag("domain", `GIT_COMMAND_TIMEOUT_ERROR`)

/**
 * Git Command Timeout Error
 */
class Timeout extends Data.TaggedError(GIT_COMMAND_TIMEOUT_ERROR_TAG)<{
	readonly timeout: Duration.DurationInput
	readonly options: ReadonlyArray<string>
	readonly command: string
	readonly args: ReadonlyArray<string>
}> {}

const GIT_COMMAND_FAILED_ERROR_TAG = Const.tag("domain", `GIT_COMMAND_FAILED_ERROR`)

/**
 * Git Command Failed Error
 */
class Failed extends Data.TaggedError(GIT_COMMAND_FAILED_ERROR_TAG)<{
	readonly exitCode: Option.Option<number>
	readonly options: ReadonlyArray<string>
	readonly command: string
	readonly args: ReadonlyArray<string>
	readonly cause?: Error
}> {}

export { Timeout, GIT_COMMAND_TIMEOUT_ERROR_TAG, Failed, GIT_COMMAND_FAILED_ERROR_TAG }
