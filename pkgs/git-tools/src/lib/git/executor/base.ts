import type { CommandExecutor } from "@effect/platform"
import { Command } from "@effect/platform"
import type { Duration, Scope } from "effect"
import { Effect, Stream, pipe, Console, Chunk, Match, Option } from "effect"
import { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"

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
	readonly subArgs: ReadonlyArray<string>
	readonly directory: string
	readonly timeout: Duration.DurationInput
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
 * @returns A function that executes the git command and returns an effect.
 */
const commandFactory = <ECode extends ErrorCode = never, Error = never>({
	directory,
	subCommand,
	subArgs,
	timeout,
	errorMatcher,
}: Arguments<ECode, Error>): Effect.Effect<
	string,
	Error | GitCommandFailedError | GitCommandTimeoutError,
	CommandExecutor.CommandExecutor | Scope.Scope
> =>
	pipe(
		Command.make("git", "--no-pager", subCommand, ...subArgs),
		Command.workingDirectory(directory),
		Command.stdout("pipe"),
		Command.stderr("pipe"),
		Command.start,
		Effect.orDie,
		Effect.flatMap(({ exitCode, stdout, stderr }) => {
			const result = pipe(
				exitCode,
				Effect.catchAll((error) =>
					Effect.fail(
						new GitCommandFailedError({
							exitCode: Option.none(),
							command: subCommand,
							args: subArgs,
							cause: error,
						})
					)
				),
				Effect.timeoutFail({
					duration: timeout,
					onTimeout: () =>
						new GitCommandTimeoutError({
							timeout,
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
										new GitCommandFailedError({
											exitCode: Option.some(errCode),
											command: subCommand,
											args: subArgs,
										})
									)
								)
							)
				)
			)
			return Effect.all(
				[
					pipe(
						stdout,
						Stream.orDie,
						Stream.decodeText(),
						Stream.runCollect,
						Effect.andThen(Chunk.join(""))
					),
					pipe(stderr, Stream.orDie, Stream.decodeText(), Stream.runForEach(Console.error)),
					result,
				],
				{ concurrency: "unbounded" }
			).pipe(Effect.map(([stdOut]) => stdOut))
		})
	)

export default commandFactory
export type { ErrorCode, Arguments }
