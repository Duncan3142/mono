import { type Error as PlatformError, type CommandExecutor, Command } from "@effect/platform"
import {
	type Cause,
	type Duration,
	type Scope,
	Effect,
	Stream,
	pipe,
	Match,
	Option,
} from "effect"
import { CommandTimeout, CommandFailed } from "./command.error.ts"
import type { ErrorCode, ErrorMatcher } from "./error-matcher.ts"

type StdPipe<Out> = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Effect type
	input: Stream.Stream<Uint8Array, CommandFailed>
) => Stream.Stream<Out, CommandFailed>

interface Arguments<
	StdOut,
	StdErr,
	ECode extends ErrorCode,
	Error extends Cause.YieldableError,
> {
	readonly directory: string
	readonly command: string
	readonly args: ReadonlyArray<string>
	readonly timeout: Duration.DurationInput
	readonly errorMatcher: ErrorMatcher<ECode, Error>
	readonly stdoutPipe: StdPipe<StdOut>
	readonly stderrPipe: StdPipe<StdErr>
}

const SUCCESS_CODE = 0

/**
 * Factory function to create a command executor.
 * @param args - The arguments for the command executor.
 * @param args.directory - The working directory for the command.
 * @param args.command - The command to run (e.g., "git").
 * @param args.args - The command arguments.
 * @param args.timeout - The timeout for the command execution.
 * @param args.errorMatcher - A matcher to handle specific error codes.
 * @param args.stdoutPipe - A function to process the standard output stream.
 * @param args.stderrPipe - A function to process the standard error stream.
 * @returns An effect that executes the command.
 */
const make = <
	StdOut = never,
	StdErr = never,
	ECode extends ErrorCode = never,
	Error extends Cause.YieldableError = never,
>({
	directory,
	command,
	args,
	timeout,
	errorMatcher,
	stdoutPipe,
	stderrPipe,
}: Arguments<StdOut, StdErr, ECode, Error>): Effect.Effect<
	Stream.Stream<StdOut | StdErr, CommandFailed | CommandTimeout | Error>,
	CommandFailed,
	CommandExecutor.CommandExecutor | Scope.Scope
> => {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Effect type
	const errorHandler = (error: PlatformError.PlatformError) =>
		new CommandFailed({
			exitCode: Option.none(),
			command,
			args,
			cause: error,
		})

	return pipe(
		Command.make(command, ...args),
		Command.workingDirectory(directory),
		Command.stdout("pipe"),
		Command.stderr("pipe"),
		Command.start,
		Effect.mapError(errorHandler),
		Effect.flatMap(({ exitCode, stdout, stderr }) => {
			const exitCodeStream = exitCode
				.pipe(
					Effect.mapError(errorHandler),
					Effect.timeoutFail({
						duration: timeout,
						onTimeout: () =>
							new CommandTimeout({
								timeout,
								command,
								args,
							}),
					}),
					Effect.flatMap((code) =>
						code === SUCCESS_CODE
							? Effect.void
							: errorMatcher({ args, command, exitCode: code }).pipe(
									Match.orElse((errCode) =>
										Effect.fail(
											new CommandFailed({
												exitCode: Option.some(errCode),
												command,
												args,
											})
										)
									)
								)
					)
				)
				.pipe(Stream.fromEffect, Stream.drain)

			const stderrStream = stderr.pipe(Stream.mapError(errorHandler), stderrPipe)

			const stdoutStream = stdout.pipe(Stream.mapError(errorHandler), stdoutPipe)

			const stdStream = Stream.merge(stdoutStream, stderrStream)

			return Effect.succeed(Stream.concat(stdStream, exitCodeStream))
		})
	)
}

export { make }
export type { Arguments, StdPipe }
