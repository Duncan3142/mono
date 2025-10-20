import type { CommandExecutor } from "@effect/platform"
import { type Effect, type Cause, type Duration, type Scope, Stream, Console } from "effect"
import { type CommandErrorMatcher, type CommandError, Command } from "@duncan3142/effect"

interface Arguments<
	ECode extends CommandErrorMatcher.ErrorCode,
	Error extends Cause.YieldableError,
> {
	readonly directory: string
	readonly command: string
	readonly args?: ReadonlyArray<string>
	readonly timeout: Duration.DurationInput
	readonly errorMatcher: CommandErrorMatcher.ErrorMatcher<ECode, Error>
}

const NO_PAGER = "--no-pager"

/**
 * Factory function to create a command executor for git commands.
 * @param args - The arguments for the command executor.
 * @param args.command - The sub-command to run (e.g., "fetch").
 * @param args.args - The arguments to pass to the git subcommand.
 * @param args.directory - The working directory for the git command.
 * @param args.timeout - The timeout for the command execution.
 * @param args.errorMatcher - A matcher to handle specific error codes.
 * @returns A function that executes the git command and returns an effect.
 */
const make = <
	ECode extends CommandErrorMatcher.ErrorCode = never,
	Error extends Cause.YieldableError = never,
>({
	directory,
	command,
	args = [],
	timeout,
	errorMatcher,
}: Arguments<ECode, Error>): Effect.Effect<
	Stream.Stream<string, CommandError.CommandFailed | Error | CommandError.CommandTimeout>,
	CommandError.CommandFailed,
	CommandExecutor.CommandExecutor | Scope.Scope
> =>
	Command.make({
		directory,
		command: "git",
		args: [NO_PAGER, command, ...args],
		timeout,
		errorMatcher,
		stdoutPipe: (stdErr) =>
			stdErr.pipe(Stream.decodeText(), Stream.splitLines, Stream.tap(Console.log)),
		stderrPipe: (stdErr) =>
			stdErr.pipe(
				Stream.decodeText(),
				Stream.splitLines,
				Stream.tap(Console.error),
				Stream.drain
			),
	})

export { make }
export type { Arguments }
