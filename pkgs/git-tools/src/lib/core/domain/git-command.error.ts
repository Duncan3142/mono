import type { Duration } from "effect"
import { Data } from "effect"
import { SERVICE_PREFIX } from "#const"

const GIT_COMMAND_TIMEOUT_ERROR_TAG = `${SERVICE_PREFIX}/GIT_COMMAND_TIMEOUT_ERROR`

/**
 * Git Command Timeout Error
 */
class GitCommandTimeoutError extends Data.TaggedError(GIT_COMMAND_TIMEOUT_ERROR_TAG)<{
	timeout: Duration.DurationInput
	command: string
	args: Array<string>
}> {}

const GIT_COMMAND_FAILED_ERROR_TAG = `${SERVICE_PREFIX}/GIT_COMMAND_FAILED_ERROR`

/**
 * Git Command Failed Error
 */
class GitCommandFailedError extends Data.TaggedError(GIT_COMMAND_FAILED_ERROR_TAG)<{
	exitCode: number
	command: string
	args: Array<string>
}> {}

export {
	GitCommandTimeoutError,
	GIT_COMMAND_TIMEOUT_ERROR_TAG,
	GitCommandFailedError,
	GIT_COMMAND_FAILED_ERROR_TAG,
}
