import { type Error as PlatformError, type CommandExecutor, Command } from "@effect/platform"
import {
	type Cause,
	type Duration,
	type Scope,
	Effect,
	Stream,
	pipe,
	Console,
	Match,
	Option,
} from "effect"
import { CommandTimeout, CommandFailed } from "./command.error.ts"

type ErrorCode = number

interface ErrorMatcherProps {
	readonly exitCode: ErrorCode
	readonly command: string
	readonly args: ReadonlyArray<string>
}

type ErrorMatcher<ECode extends ErrorCode, Error extends Cause.YieldableError> = (
	props: ErrorMatcherProps
) => Match.Matcher<
	ErrorCode,
	Match.Types.Without<ECode>,
	ErrorCode,
	Effect.Effect<never, Error>,
	ErrorCode
>

interface Arguments<ECode extends ErrorCode, Error extends Cause.YieldableError> {
	readonly command: string
	readonly args: ReadonlyArray<string>
	readonly directory: string
	readonly timeout: Duration.DurationInput
	readonly errorMatcher: ErrorMatcher<ECode, Error>
}

const SUCCESS_CODE = 0

/**
 * Factory function to create a command executor.
 * @param args - The arguments for the command executor.
 * @param args.command - The command to run (e.g., "git").
 * @param args.args - The command arguments.
 * @param args.directory - The working directory for the command.
 * @param args.timeout - The timeout for the command execution.
 * @param args.errorMatcher - A matcher to handle specific error codes.
 * @returns An effect that executes the command.
 */
const make = <ECode extends ErrorCode = never, Error extends Cause.YieldableError = never>({
	command,
	args,
	directory,
	timeout,
	errorMatcher,
}: Arguments<ECode, Error>): Effect.Effect<
	Stream.Stream<string, CommandFailed | CommandTimeout | Error>,
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

			const stderrStream = stderr.pipe(
				Stream.decodeText(),
				Stream.splitLines,
				Stream.tap(Console.error),
				Stream.drain
			)

			const stdoutStream = stdout.pipe(
				Stream.decodeText(),
				Stream.splitLines,
				Stream.tap(Console.log)
			)

			const stdStream = Stream.merge(stdoutStream, stderrStream).pipe(
				Stream.mapError(errorHandler)
			)

			return Effect.succeed(Stream.concat(stdStream, exitCodeStream))
		})
	)
}

export { make }
export type { ErrorCode, Arguments, ErrorMatcher, ErrorMatcherProps }
