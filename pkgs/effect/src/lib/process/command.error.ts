import { type Duration, type Option, Data } from "effect"
import { TagFactory } from "#duncan3142/effect/internal"

const COMMAND_TIMEOUT_ERROR_TAG = TagFactory.make("process", `COMMAND_TIMEOUT_ERROR`)

/**
 * Command Timeout Error
 */
class CommandTimeout extends Data.TaggedError(COMMAND_TIMEOUT_ERROR_TAG)<{
	readonly timeout: Duration.DurationInput
	readonly command: string
	readonly args: ReadonlyArray<string>
}> {}

const COMMAND_FAILED_ERROR_TAG = TagFactory.make("process", `COMMAND_FAILED_ERROR`)

/**
 * Command Failed Error
 */
class CommandFailed extends Data.TaggedError(COMMAND_FAILED_ERROR_TAG)<{
	readonly exitCode: Option.Option<number>
	readonly command: string
	readonly args: ReadonlyArray<string>
	readonly cause?: Error
}> {}

export { CommandTimeout, COMMAND_TIMEOUT_ERROR_TAG, CommandFailed, COMMAND_FAILED_ERROR_TAG }
