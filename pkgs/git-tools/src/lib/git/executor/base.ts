import { type Error as PlatformError, type CommandExecutor, Command } from "@effect/platform"
import {
	type Duration,
	type Scope,
	Effect,
	Stream,
	pipe,
	Console,
	Match,
	Option,
	Either,
} from "effect"
import { GitCommandError } from "#duncan3142/git-tools/domain"

type ErrorMatcher<ECode extends ErrorCode, Error> = (
	ecode: ErrorCode
) => Match.Matcher<
	ErrorCode,
	Match.Types.Without<ECode>,
	ErrorCode,
	Effect.Effect<never, Error>,
	ErrorCode
>

type StdOutHandler<Res> = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Effect type
	stream: Stream.Stream<string, GitCommandError.GitCommandFailed>
) => Effect.Effect<Res, GitCommandError.GitCommandFailed>

interface Arguments<ECode extends ErrorCode, Res, Error> {
	readonly subCommand: string
	readonly subArgs?: ReadonlyArray<string>
	readonly directory: string
	readonly timeout: Duration.DurationInput
	readonly noPager?: boolean
	readonly errorMatcher: ErrorMatcher<ECode, Error>
	readonly stdoutHandler: StdOutHandler<Res>
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
 * @param args.stdoutHandler - A handler for processing the standard output of the command.
 * @param args.noPager - Whether to disable the pager for git commands.
 * @returns A function that executes the git command and returns an effect.
 */
const make = <Res, ECode extends ErrorCode = never, Error = never>({
	directory,
	subCommand,
	subArgs = [],
	timeout,
	errorMatcher,
	stdoutHandler,
	noPager = false,
}: Arguments<ECode, Res, Error>): Effect.Effect<
	Res,
	Error | GitCommandError.GitCommandFailed | GitCommandError.GitCommandTimeout,
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
			const exitCodeEffect = exitCode.pipe(
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

			const stderrEffect = stderr.pipe(
				Stream.decodeText(),
				Stream.mapError(errorHandler),
				Stream.runForEach(Console.error)
			)

			const stdoutEffect = stdout.pipe(
				Stream.decodeText(),
				Stream.mapError(errorHandler),
				Stream.tap(Console.log),
				stdoutHandler
			)

			return Effect.all([stdoutEffect, stderrEffect, exitCodeEffect], {
				concurrency: "unbounded",
				mode: "either",
			}).pipe(
				Effect.andThen(Either.all),
				Effect.map(([res]) => res)
			)
		})
	)
}

export { make }
export type { ErrorCode, Arguments }
