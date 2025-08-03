import type { Duration } from "effect"
import { Data } from "effect"
import { tag } from "#const"

const GIT_COMMAND_TIMEOUT_ERROR_TAG = tag(`GIT_COMMAND_TIMEOUT_ERROR`)

/**
 * Git Command Timeout Error
 */
class GitCommandTimeoutError extends Data.TaggedError(GIT_COMMAND_TIMEOUT_ERROR_TAG)<{
	readonly timeout: Duration.DurationInput
	readonly command: string
	readonly args: ReadonlyArray<string>
}> {}

const GIT_COMMAND_FAILED_ERROR_TAG = tag(`GIT_COMMAND_FAILED_ERROR`)

/**
 * Git Command Failed Error
 */
class GitCommandFailedError extends Data.TaggedError(GIT_COMMAND_FAILED_ERROR_TAG)<{
	readonly exitCode: number
	readonly command: string
	readonly args: ReadonlyArray<string>
}> {}

export {
	GitCommandTimeoutError,
	GIT_COMMAND_TIMEOUT_ERROR_TAG,
	GitCommandFailedError,
	GIT_COMMAND_FAILED_ERROR_TAG,
}
