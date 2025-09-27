import { type Error as PlatformError, type CommandExecutor, Command } from "@effect/platform"
import { type Duration, type Scope, Effect, Stream, pipe, Console, Match, Option } from "effect"
import { GitCommandError } from "#duncan3142/git-tools/lib/core/domain"

type ErrorMatcher<ECode extends ErrorCode, Error> = (
	ecode: ErrorCode
) => Match.Matcher<
	ErrorCode,
	Match.Types.Without<ECode>,
	ErrorCode,
	Effect.Effect<never, Error>,
	ErrorCode
>

interface Arguments<ECode extends ErrorCode, Error> {
	readonly subCommand: string
	readonly subArgs?: ReadonlyArray<string>
	readonly directory: string
	readonly timeout: Duration.DurationInput
	readonly noPager?: boolean
	readonly errorMatcher: ErrorMatcher<ECode, Error>
}

const SUCCESS_CODE = 0

type ErrorCode = number

/**
 * Factory function to create a command executor for git commands.
 * @param args - The arguments for the command executor.
 * @param args.subCommand - The sub-command to run (e.g., "fetch").
 * @param args.subArgs - The arguments to pass to the git subcommand.
 * @param args.directory - The working directory for the git command.
 * @param args.timeout - The timeout for the command execution.
 * @param args.errorMatcher - A matcher to handle specific error codes.
 * @param args.noPager - Whether to disable the pager for git commands.
 * @returns A function that executes the git command and returns an effect.
 */
const make = <ECode extends ErrorCode = never, Error = never>({
	directory,
	subCommand,
	subArgs = [],
	timeout,
	errorMatcher,
	noPager = false,
}: Arguments<ECode, Error>): Effect.Effect<
	Stream.Stream<
		string,
		GitCommandError.GitCommandFailed | Error | GitCommandError.GitCommandTimeout
	>,
	GitCommandError.GitCommandFailed,
	CommandExecutor.CommandExecutor | Scope.Scope
> => {
	const options = noPager ? ["--no-pager"] : []
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Effect type
	const errorHandler = (error: PlatformError.PlatformError) =>
		new GitCommandError.GitCommandFailed({
			exitCode: Option.none(),
			options,
			command: subCommand,
			args: subArgs,
			cause: error,
		})

	return pipe(
		Command.make("git", ...options, subCommand, ...subArgs),
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
							new GitCommandError.GitCommandTimeout({
								timeout,
								options,
								command: subCommand,
								args: subArgs,
							}),
					}),
					Effect.flatMap((code) =>
						code === SUCCESS_CODE
							? Effect.void
							: errorMatcher(code).pipe(
									Match.orElse((errCode) =>
										Effect.fail(
											new GitCommandError.GitCommandFailed({
												exitCode: Option.some(errCode),
												options,
												command: subCommand,
												args: subArgs,
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
export type { ErrorCode, Arguments }
