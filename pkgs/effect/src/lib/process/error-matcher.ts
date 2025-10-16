import { type Effect, type Cause, Match } from "effect"

type ErrorCode = number

interface ErrorMatcherArgs {
	readonly exitCode: ErrorCode
	readonly command: string
	readonly args: ReadonlyArray<string>
}

type ErrorMatcher<ECode extends ErrorCode, Error extends Cause.YieldableError> = (
	args: ErrorMatcherArgs
) => Match.Matcher<
	ErrorCode,
	Match.Types.Without<ECode>,
	ErrorCode,
	Effect.Effect<never, Error>,
	ErrorCode
>

/**
 * A no-op error matcher that does not match any error codes.
 * @param props - The properties containing the exit code, command, and arguments.
 * @param props.exitCode - The exit code of the command.
 * @returns A matcher that does not match any error codes.
 */
const noOp: ErrorMatcher<never, never> = ({ exitCode }) => Match.value(exitCode)

export { type ErrorCode, type ErrorMatcherArgs, type ErrorMatcher, noOp }
