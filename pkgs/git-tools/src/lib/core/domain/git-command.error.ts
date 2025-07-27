import { TaggedError } from "effect/Data"
import type { DurationInput } from "effect/Duration"
import { SERVICE_PREFIX } from "#const"

const GIT_COMMAND_TIMEOUT_ERROR_TAG = `${SERVICE_PREFIX}/GIT_COMMAND_TIMEOUT_ERROR`

/**
 * Git Command Timeout Error
 */
class GitCommandTimeoutError extends TaggedError(GIT_COMMAND_TIMEOUT_ERROR_TAG)<{
	timeout: DurationInput
	command: string
	args: Array<string>
}> {}

const GIT_COMMAND_FAILED_ERROR_TAG = `${SERVICE_PREFIX}/GIT_COMMAND_FAILED_ERROR`

/**
 * Git Command Failed Error
 */
class GitCommandFailedError extends TaggedError(GIT_COMMAND_FAILED_ERROR_TAG)<{
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
